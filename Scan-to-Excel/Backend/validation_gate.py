import re
from typing import Any, Dict, List, Tuple

from deterministic_rules import Candidate


def _valid_time(text: str) -> bool:
    match = re.match(r"^(\d{1,2}):(\d{2})$", text.strip())
    if not match:
        return False
    hh = int(match.group(1))
    mm = int(match.group(2))
    return 0 <= hh <= 23 and 0 <= mm <= 59


def _valid_class(text: str, cfg) -> bool:
    token = text.strip().lower()
    if not token:
        return True
    if token in {v.lower() for v in cfg.valid_class_ordinals}:
        return True
    if token.isdigit():
        return 1 <= int(token) <= 12
    return False


def validate_candidate(
    candidate: Candidate, column_name: str, row_ctx: Dict[str, Any], cfg
) -> Tuple[bool, str]:
    text = (candidate.text or "").strip()
    lower = column_name.lower()

    if "students" in lower or "count" in lower:
        if text:
            if not text.isdigit():
                return False, "non_numeric_student_count"
            min_v, max_v = cfg.student_count_range
            value = int(text)
            if value < min_v or value > max_v:
                return False, "student_count_out_of_range"
    if "time" in lower and text:
        if not _valid_time(text):
            return False, "invalid_time_format"
    if ("class taught" in lower or lower == "class") and text:
        if not _valid_class(text, cfg):
            return False, "invalid_class_token"
    if "subject" in lower and text:
        if len(text) > 32:
            return False, "subject_too_long"

    return True, ""


def final_validation_gate(
    cell_candidates_sorted: List[Candidate], column_name: str, row_ctx: Dict[str, Any], cfg
) -> Candidate:
    """
    Validate winner and fallback to next best valid candidate.
    """
    for c in cell_candidates_sorted:
        if c.rejected:
            continue
        is_valid, reason = validate_candidate(c, column_name, row_ctx, cfg)
        if is_valid:
            return c
        c.rejected = True
        c.reason = c.reason or reason

    # Last resort: original if present, else highest score.
    originals = [c for c in cell_candidates_sorted if c.source == "original"]
    if originals:
        return originals[0]
    return sorted(cell_candidates_sorted, key=lambda x: x.final_score, reverse=True)[0]

