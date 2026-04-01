import json
import os
import re
from typing import Any, Dict, List, Optional, Union
from urllib import error, parse, request

from ocr_auto_correction import clean_ocr_table_data_with_meta, normalize_records

GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def _extract_text_from_response(payload: Dict[str, Any]) -> str:
    candidates = payload.get("candidates", [])
    if not candidates:
        return ""

    text_chunks: List[str] = []
    for candidate in candidates:
        content = candidate.get("content", {})
        parts = content.get("parts", [])
        for part in parts:
            text = part.get("text")
            if isinstance(text, str):
                text_chunks.append(text)
    return "\n".join(text_chunks).strip()


def _extract_json_array(text: str) -> Optional[List[dict]]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    start = cleaned.find("[")
    end = cleaned.rfind("]")
    if start == -1 or end == -1 or end < start:
        return None

    candidate = cleaned[start : end + 1]
    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError:
        return None

    if isinstance(parsed, list):
        return parsed
    return None


def _build_prompt(ocr_data: Union[str, List[List[object]]], existing_rows: Optional[List[dict]] = None) -> str:
    existing_note = ""
    if existing_rows:
        existing_note = (
            "\nLocal correction draft rows:\n"
            f"{json.dumps(existing_rows, ensure_ascii=True)}\n"
            "Please improve only uncertain or malformed values and preserve correct fields.\n"
        )
    return (
        "You are an OCR correction engine.\n"
        "Fix OCR spelling and handwriting errors and return STRICT JSON only.\n"
        "Output format must be exactly:\n"
        "[{\"Date\":\"...\",\"Subject\":\"...\",\"Activity\":\"...\"}]\n\n"
        "Rules:\n"
        "- Columns are Date, Subject, Activity\n"
        "- Subject and Activity are open-ended text fields\n"
        "- Correct OCR mistakes but do not over-normalize to a fixed list\n"
        "- Fill missing values with \"Unknown\"\n"
        "- Handle broken rows and extra noise characters\n"
        "- Date should be normalized to DD/MM where possible, else Unknown\n\n"
        f"OCR input:\n{json.dumps(ocr_data, ensure_ascii=True)}"
        f"{existing_note}"
    )


def _call_gemini_json(prompt: str, api_key: str, timeout_seconds: int = 30) -> Dict[str, Any]:
    endpoint = GEMINI_ENDPOINT.format(model=GEMINI_MODEL)
    url = f"{endpoint}?{parse.urlencode({'key': api_key})}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.1},
    }
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with request.urlopen(req, timeout=timeout_seconds) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw)
    except error.HTTPError as exc:
        err_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Gemini HTTP {exc.code}: {err_body}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Gemini connection error: {exc.reason}") from exc


def autocorrect_with_gemini(ocr_data: Union[str, List[List[object]]]) -> Dict[str, Any]:
    """
    Gemini-based OCR auto-correction with strict schema normalization and local fallback.
    """
    local = clean_ocr_table_data_with_meta(ocr_data)
    local_records = local["records"]
    local_low_conf_rows = local["low_confidence_rows"]
    local_needs_review = bool(local["needs_review"])

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return {
            "data": local_records,
            "source": "rules_fallback",
            "used_fallback": True,
            "error": "GEMINI_API_KEY is missing",
            "needs_review": local_needs_review,
            "low_confidence_rows": local_low_conf_rows,
        }

    # Only escalate to Gemini when the local pass is uncertain.
    if not local_low_conf_rows:
        return {
            "data": local_records,
            "source": "rules_primary",
            "used_fallback": False,
            "error": None,
            "needs_review": local_needs_review,
            "low_confidence_rows": local_low_conf_rows,
        }

    prompt = _build_prompt(ocr_data, existing_rows=local_records)
    try:
        gemini_payload = _call_gemini_json(prompt, api_key=api_key)
        gemini_text = _extract_text_from_response(gemini_payload)
        parsed = _extract_json_array(gemini_text)
        if parsed is None:
            raise RuntimeError("Gemini response did not contain a valid JSON array.")

        normalized = normalize_records(parsed)
        if not normalized:
            raise RuntimeError("Gemini output was empty after normalization.")

        return {
            "data": normalized,
            "source": "gemini",
            "used_fallback": False,
            "error": None,
            "needs_review": any(
                row.get("Date") == "Unknown"
                or row.get("Subject") == "Unknown"
                or row.get("Activity") == "Unknown"
                for row in normalized
            ),
            "low_confidence_rows": local_low_conf_rows,
        }
    except Exception as exc:
        return {
            "data": local_records,
            "source": "rules_fallback",
            "used_fallback": True,
            "error": str(exc),
            "needs_review": local_needs_review,
            "low_confidence_rows": local_low_conf_rows,
        }
