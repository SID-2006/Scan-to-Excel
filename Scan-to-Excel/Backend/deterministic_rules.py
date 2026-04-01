import re
from difflib import SequenceMatcher
from typing import Any, Dict, List, Optional


class Candidate:
    def __init__(self, source, text, raw_confidence, strict=False):
        self.source = source
        self.text = text
        self.raw_confidence = raw_confidence
        self.normalized_confidence = 0
        self.final_score = 0
        self.strict = strict
        self.reason = None
        self.rejected = False


def candidate_to_dict(candidate: Candidate) -> Dict[str, Any]:
    return {
        "source": candidate.source,
        "text": candidate.text,
        "raw_confidence": candidate.raw_confidence,
        "normalized_confidence": candidate.normalized_confidence,
        "final_score": candidate.final_score,
        "strict": candidate.strict,
        "reason": candidate.reason,
        "rejected": candidate.rejected,
    }


def _parse_time(text: str) -> Optional[str]:
    cleaned = re.sub(r"[^0-9:]", "", text or "")
    if not cleaned:
        return None
    if ":" in cleaned:
        parts = cleaned.split(":")
        if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
            h, m = int(parts[0]), int(parts[1])
            if 0 <= h <= 23 and 0 <= m <= 59:
                return f"{h}:{m:02d}"
        return None
    if cleaned.isdigit() and len(cleaned) in (3, 4):
        h = int(cleaned[:-2])
        m = int(cleaned[-2:])
        if 0 <= h <= 23 and 0 <= m <= 59:
            return f"{h}:{m:02d}"
    return None


def _parse_student_count(text: str, cfg) -> Optional[str]:
    if not text:
        return None
    
    # Pre-clean common handwritten-to-alpha misreads in numeric col
    token = text.upper().strip()
    replacements = {
        "E": "3",
        "B": "8",
        "S": "5",
        "O": "0",
        "G": "6",
        "T": "7",
        "Z": "2",
        "I": "1",
        "L": "1",
    }
    for char, digit in replacements.items():
        if token == char:
            token = digit
            break
            
    digits = re.findall(r"\d+", token)
    if not digits:
        return None
    value = int(digits[0])
    min_v, max_v = cfg.student_count_range
    if min_v <= value <= max_v:
        return str(value)
    return None


def _parse_class_ordinal(text: str) -> Optional[str]:
    raw = (text or "").strip().lower()
    if not raw:
        return None
    raw = raw.replace(" ", "")
    number_match = re.search(r"\d{1,3}", raw)
    if not number_match:
        return None
    number = int(number_match.group(0))
    if not (1 <= number <= 12):
        # OCR noise heuristic for class column:
        # examples like "228", "28", "2S8" often mean class 2nd.
        digits = re.findall(r"\d", raw)
        if digits:
            lead = int(digits[0])
            if 1 <= lead <= 9:
                number = lead
            else:
                return None
        else:
            return None
    if number == 1:
        return "1st"
    if number == 2:
        return "2nd"
    if number == 3:
        return "3rd"
    return f"{number}th"


def _fuzzy_subject(text: str, cfg) -> Optional[str]:
    token = re.sub(r"[^A-Za-z]", "", (text or "").lower())
    if not token:
        return None
    direct_map = {
        "ak": "GK",
        "gk": "GK",
        "ck": "GK",
        "maathi": "Marathi",
        "marati": "Marathi",
    }
    if token in direct_map:
        return direct_map[token]
    best = None
    best_score = -1.0
    for subject in cfg.valid_subjects:
        score = SequenceMatcher(None, token, subject.lower()).ratio()
        if score > best_score:
            best = subject
            best_score = score
    if best and best_score >= 0.50:
        return best
    return None


def generate_deterministic_candidates(cell_ctx: Dict[str, Any], cfg, cache) -> List[Candidate]:
    """
    Generate strict/soft deterministic candidates for one cell.
    """
    column_name = cell_ctx["column_name"].lower()
    text = cell_ctx["text"]
    is_class_data_row = bool(cell_ctx.get("is_class_data_row", False))
    candidates: List[Candidate] = []

    if any(name in column_name for name in cfg.protected_columns):
        # Protected columns: no aggressive deterministic rewrite.
        return candidates

    class_columns = {"in-time", "out-time", "class taught", "no of students", "subject", "class activity", "homework"}
    if column_name in class_columns and not is_class_data_row:
        return candidates

    if "students" in column_name or "count" in column_name:
        value = _parse_student_count(text, cfg)
        if value is not None and value != text:
            c = Candidate("deterministic", value, 0.95, strict=True)
            c.reason = "strict_numeric_extraction"
            c.normalized_confidence = 0.95
            candidates.append(c)

    if "time" in column_name:
        value = _parse_time(text)
        if value is not None and value != text:
            c = Candidate("deterministic", value, 0.92, strict=True)
            c.reason = "strict_time_format"
            c.normalized_confidence = 0.92
            candidates.append(c)

    if "class taught" in column_name or (column_name == "class"):
        value = _parse_class_ordinal(text)
        if value is not None and value != text:
            c = Candidate("deterministic", value, 0.88, strict=True)
            c.reason = "strict_class_ordinal"
            c.normalized_confidence = 0.88
            candidates.append(c)

    if "subject" in column_name:
        value = _fuzzy_subject(text, cfg)
        if value is not None and value != text:
            c = Candidate("deterministic", value, 0.78, strict=False)
            c.reason = "soft_subject_fuzzy"
            c.normalized_confidence = 0.78
            candidates.append(c)

    return candidates
