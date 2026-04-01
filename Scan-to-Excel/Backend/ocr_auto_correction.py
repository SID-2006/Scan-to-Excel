import json
import os
import re
import unicodedata
from datetime import datetime, timedelta
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple, Union

from rapidfuzz import fuzz, process

SUBJECT_CHOICES: Tuple[str, ...] = (
    "Math",
    "Science",
    "English",
    "History",
    "Geography",
)

ACTIVITY_CHOICES: Tuple[str, ...] = (
    "Homework",
    "Lecture",
    "Lab",
    "Exam",
)

SUBJECT_ALIASES = {
    "maths": "Math",
    "mth": "Math",
    "matic": "Math",
    "scient": "Science",
    "eng": "English",
    "engl": "English",
    "hist": "History",
    "geo": "Geography",
}

ACTIVITY_ALIASES = {
    "homeworkk": "Homework",
    "homewrk": "Homework",
    "hmework": "Homework",
    "lectur": "Lecture",
    "lcture": "Lecture",
    "practical": "Lab",
    "laboratory": "Lab",
    "test": "Exam",
    "xam": "Exam",
}

# Common OCR/handwriting confusions for alphabetic fields.
OCR_CHAR_MAP = str.maketrans({
    "0": "o",
    "1": "l",
    "3": "e",
    "4": "a",
    "5": "s",
    "6": "g",
    "7": "t",
    "8": "b",
    "9": "g",
    "$": "s",
    "@": "a",
    "|": "l",
})

DATE_PATTERN = re.compile(r"(?<!\d)(\d{1,2})\s*[-./]\s*(\d{1,2})(?:\s*[-./]\s*(\d{2,4}))?(?!\d)")
NOISE_PATTERN = re.compile(r"[^A-Za-z0-9/\-.,:;|\t\s]")
MULTISPACE_PATTERN = re.compile(r"\s+")


TableInput = Union[str, Sequence[Sequence[object]]]
CORRECTIONS_FILE = os.path.join(os.path.dirname(__file__), "corrections_vocab.json")
_CUSTOM_SUBJECT_ALIASES: Optional[Dict[str, str]] = None
_CUSTOM_ACTIVITY_ALIASES: Optional[Dict[str, str]] = None


def _clean_token(raw: object) -> str:
    text = unicodedata.normalize("NFKC", str(raw or ""))
    text = NOISE_PATTERN.sub(" ", text)
    text = text.replace("\u00a0", " ")
    text = MULTISPACE_PATTERN.sub(" ", text).strip()
    return text


def _load_custom_aliases() -> Tuple[Dict[str, str], Dict[str, str]]:
    global _CUSTOM_SUBJECT_ALIASES, _CUSTOM_ACTIVITY_ALIASES
    if _CUSTOM_SUBJECT_ALIASES is not None and _CUSTOM_ACTIVITY_ALIASES is not None:
        return _CUSTOM_SUBJECT_ALIASES, _CUSTOM_ACTIVITY_ALIASES

    subject_aliases: Dict[str, str] = {}
    activity_aliases: Dict[str, str] = {}
    if os.path.exists(CORRECTIONS_FILE):
        try:
            with open(CORRECTIONS_FILE, "r", encoding="utf-8") as fh:
                payload = json.load(fh)
            subject_payload = payload.get("subject_aliases", {}) if isinstance(payload, dict) else {}
            activity_payload = payload.get("activity_aliases", {}) if isinstance(payload, dict) else {}
            if isinstance(subject_payload, dict):
                subject_aliases = {
                    _word_for_matching(k): str(v).strip()
                    for k, v in subject_payload.items()
                    if _word_for_matching(k) and str(v).strip()
                }
            if isinstance(activity_payload, dict):
                activity_aliases = {
                    _word_for_matching(k): str(v).strip()
                    for k, v in activity_payload.items()
                    if _word_for_matching(k) and str(v).strip()
                }
        except Exception:
            subject_aliases = {}
            activity_aliases = {}

    _CUSTOM_SUBJECT_ALIASES = subject_aliases
    _CUSTOM_ACTIVITY_ALIASES = activity_aliases
    return _CUSTOM_SUBJECT_ALIASES, _CUSTOM_ACTIVITY_ALIASES


def _word_for_matching(token: str) -> str:
    cleaned = _clean_token(token).lower()
    cleaned = cleaned.translate(OCR_CHAR_MAP)
    cleaned = re.sub(r"[^a-z]", "", cleaned)
    return cleaned


def _normalize_open_value(token: str) -> str:
    cleaned = _clean_token(token).lower().translate(OCR_CHAR_MAP)
    cleaned = re.sub(r"[^a-z\s]", " ", cleaned)
    cleaned = MULTISPACE_PATTERN.sub(" ", cleaned).strip()
    if not cleaned:
        return "Unknown"
    return " ".join(part.capitalize() for part in cleaned.split(" "))


def _normalize_date(token: str) -> Optional[str]:
    match = DATE_PATTERN.search(_clean_token(token))
    if not match:
        return None

    day = int(match.group(1))
    month = int(match.group(2))

    if not (1 <= day <= 31 and 1 <= month <= 12):
        return None

    return f"{day:02d}/{month:02d}"


def _fuzzy_pick(token: str, choices: Sequence[str], aliases: dict, threshold: int = 72) -> Optional[str]:
    word = _word_for_matching(token)
    if not word:
        return None

    if word in aliases:
        return aliases[word]

    match = process.extractOne(word, choices, scorer=fuzz.WRatio)
    if not match:
        return None

    best_choice, score, _ = match
    if score >= threshold:
        return best_choice
    return None


def _normalize_subject(token: str) -> str:
    custom_subject_aliases, _ = _load_custom_aliases()
    custom_key = _word_for_matching(token)
    if custom_key and custom_key in custom_subject_aliases:
        return custom_subject_aliases[custom_key]
    exact = _fuzzy_pick(token, SUBJECT_CHOICES, SUBJECT_ALIASES)
    if exact:
        return exact
    return _normalize_open_value(token)


def _normalize_activity(token: str) -> str:
    _, custom_activity_aliases = _load_custom_aliases()
    custom_key = _word_for_matching(token)
    if custom_key and custom_key in custom_activity_aliases:
        return custom_activity_aliases[custom_key]
    exact = _fuzzy_pick(token, ACTIVITY_CHOICES, ACTIVITY_ALIASES)
    if exact:
        return exact
    return _normalize_open_value(token)


def _split_line_to_tokens(line: str) -> List[str]:
    line = _clean_token(line)
    if not line:
        return []

    if re.search(r"[|,;\t]", line):
        parts = re.split(r"[|,;\t]+", line)
    else:
        parts = re.split(r"\s{2,}", line)
        if len(parts) == 1:
            parts = line.split()

    return [p.strip() for p in parts if p.strip()]


def _to_token_rows(data: TableInput) -> List[List[str]]:
    if isinstance(data, str):
        lines = [ln.strip() for ln in data.splitlines() if ln.strip()]
        return [_split_line_to_tokens(line) for line in lines if _split_line_to_tokens(line)]

    token_rows: List[List[str]] = []
    for row in data:
        row_tokens: List[str] = []
        for cell in row:
            cell_clean = _clean_token(cell)
            if not cell_clean:
                continue
            if re.search(r"[|,;\t]", cell_clean):
                row_tokens.extend([p.strip() for p in re.split(r"[|,;\t]+", cell_clean) if p.strip()])
            else:
                # Preserve whole cell text (including spaces) for table-style OCR input.
                row_tokens.append(cell_clean)
        if row_tokens:
            token_rows.append(row_tokens)
    return token_rows


def _next_empty(row: List[str]) -> Optional[int]:
    for i, value in enumerate(row):
        if not value:
            return i
    return None


def _assign_token(row: List[str], token: str) -> None:
    maybe_date = _normalize_date(token)
    maybe_subject = _fuzzy_pick(token, SUBJECT_CHOICES, SUBJECT_ALIASES)
    maybe_activity = _fuzzy_pick(token, ACTIVITY_CHOICES, ACTIVITY_ALIASES)

    if maybe_date and not row[0]:
        row[0] = maybe_date
        return

    if maybe_subject and not row[1]:
        row[1] = maybe_subject
        return

    if maybe_activity and not row[2]:
        row[2] = maybe_activity
        return

    slot = _next_empty(row)
    if slot is not None:
        row[slot] = token


def _rebuild_rows(token_rows: Iterable[List[str]]) -> List[dict]:
    results: List[dict] = []
    current = ["", "", ""]  # Date, Subject, Activity

    def flush_current() -> None:
        nonlocal current
        if not any(current):
            return
        record = {
            "Date": _normalize_date(current[0]) or "Unknown",
            "Subject": _normalize_subject(current[1]),
            "Activity": _normalize_activity(current[2]),
        }
        # Skip rows that are pure OCR noise and contain no recoverable signal.
        if not (
            record["Date"] == "Unknown"
            and record["Subject"] == "Unknown"
            and record["Activity"] == "Unknown"
        ):
            results.append(record)
        current = ["", "", ""]

    for tokens in token_rows:
        for token in tokens:
            if _normalize_date(token) and any(current):
                flush_current()
            _assign_token(current, token)

        if all(current):
            flush_current()

    flush_current()
    return results


def _parse_date_to_obj(value: str) -> Optional[datetime]:
    if value == "Unknown":
        return None
    try:
        return datetime.strptime(value, "%d/%m")
    except Exception:
        return None


def _repair_missing_dates(records: List[dict]) -> List[dict]:
    if not records:
        return records

    repaired = [row.copy() for row in records]
    known = [(idx, _parse_date_to_obj(row.get("Date", "Unknown"))) for idx, row in enumerate(repaired)]
    known = [(idx, dt) for idx, dt in known if dt is not None]
    if len(known) < 2:
        return repaired

    for idx in range(len(repaired)):
        if repaired[idx].get("Date") != "Unknown":
            continue

        prev = next(((i, d) for i, d in reversed(known) if i < idx), None)
        nxt = next(((i, d) for i, d in known if i > idx), None)

        inferred = None
        if prev and nxt:
            gap = nxt[0] - prev[0]
            if gap > 0:
                offset = idx - prev[0]
                inferred = prev[1] + timedelta(days=offset)
        elif prev:
            inferred = prev[1] + timedelta(days=1)
        elif nxt:
            inferred = nxt[1] - timedelta(days=1)

        if inferred is not None:
            repaired[idx]["Date"] = inferred.strftime("%d/%m")
    return repaired


def _merge_broken_rows(records: List[dict]) -> List[dict]:
    if not records:
        return records

    merged: List[dict] = []
    for row in records:
        current = row.copy()
        if not merged:
            merged.append(current)
            continue

        missing_count = sum(1 for key in ("Date", "Subject", "Activity") if current.get(key) == "Unknown")
        has_only_activity = current.get("Date") == "Unknown" and current.get("Subject") == "Unknown" and current.get("Activity") != "Unknown"
        has_only_subject = current.get("Date") == "Unknown" and current.get("Subject") != "Unknown" and current.get("Activity") == "Unknown"

        if missing_count >= 2 or has_only_activity or has_only_subject:
            prev = merged[-1]
            for key in ("Date", "Subject", "Activity"):
                if prev.get(key) == "Unknown" and current.get(key) != "Unknown":
                    prev[key] = current[key]
            continue

        merged.append(current)
    return merged


def _record_confidence(record: dict) -> float:
    unknown_count = sum(1 for key in ("Date", "Subject", "Activity") if record.get(key) == "Unknown")
    if unknown_count == 0:
        return 0.95
    if unknown_count == 1:
        return 0.70
    if unknown_count == 2:
        return 0.45
    return 0.20


def clean_ocr_table_data_with_meta(ocr_data: TableInput) -> Dict[str, Any]:
    token_rows = _to_token_rows(ocr_data)
    records = _rebuild_rows(token_rows)
    records = _merge_broken_rows(records)
    records = _repair_missing_dates(records)

    row_meta = []
    low_confidence_rows = []
    for idx, row in enumerate(records):
        conf = _record_confidence(row)
        row_meta.append({"index": idx, "confidence": conf, "row": row})
        if conf < 0.75:
            low_confidence_rows.append(idx)

    needs_review = bool(low_confidence_rows) or any(
        row["Date"] == "Unknown" or row["Subject"] == "Unknown" or row["Activity"] == "Unknown"
        for row in records
    )

    return {
        "records": records,
        "row_meta": row_meta,
        "low_confidence_rows": low_confidence_rows,
        "needs_review": needs_review,
    }


def clean_ocr_table_data(ocr_data: TableInput) -> List[dict]:
    """
    Clean OCR table output into strict records with Date/Subject/Activity.

    Pipeline:
    OCR -> Basic Cleaning -> Rule-Based Fix -> Structured Output.
    """
    return clean_ocr_table_data_with_meta(ocr_data)["records"]


def normalize_records(records: Sequence[dict]) -> List[dict]:
    """Normalize arbitrary records into strict Date/Subject/Activity JSON rows."""
    normalized: List[dict] = []
    for row in records:
        if not isinstance(row, dict):
            continue

        date_raw = row.get("Date", row.get("date", ""))
        subject_raw = row.get("Subject", row.get("subject", ""))
        activity_raw = row.get("Activity", row.get("activity", ""))

        record = {
            "Date": _normalize_date(str(date_raw)) or "Unknown",
            "Subject": _normalize_subject(str(subject_raw)),
            "Activity": _normalize_activity(str(activity_raw)),
        }
        if not (
            record["Date"] == "Unknown"
            and record["Subject"] == "Unknown"
            and record["Activity"] == "Unknown"
        ):
            normalized.append(record)
    return normalized


def clean_ocr_table_data_json(ocr_data: TableInput) -> str:
    """Return cleaned OCR records as a strict JSON string."""
    return json.dumps(clean_ocr_table_data(ocr_data), ensure_ascii=True)


if __name__ == "__main__":
    sample = [["12/02", "M4th", "H0mework"], ["13/02", "Englsh", "Lectur"]]
    print(clean_ocr_table_data_json(sample))
