from collections import Counter
from typing import Any, Dict, List

from deterministic_rules import Candidate


def _row_mode_time(table_ctx: Dict[str, Any], col_idx: int) -> str:
    values = []
    for row in table_ctx.get("normalized_grid", []):
        if col_idx < len(row):
            token = str(row[col_idx]).strip()
            if token and ":" in token:
                values.append(token)
    if not values:
        return ""
    return Counter(values).most_common(1)[0][0]


def generate_context_candidates(
    cell_ctx: Dict[str, Any],
    row_ctx: Dict[str, Any],
    table_ctx: Dict[str, Any],
    cfg,
    cache,
) -> List[Candidate]:
    """
    Row/neighbor-aware candidate generation.
    Produces suggestions only; final override is governed by arbitration rules.
    """
    column_name = cell_ctx["column_name"].lower()
    text = cell_ctx["text"].strip()
    col_idx = cell_ctx["col_idx"]
    candidates: List[Candidate] = []

    is_class_data_row = bool(row_ctx.get("is_class_data_row", False))
    row_has_payload = bool(row_ctx.get("row_has_payload", False))

    if not text and "time" in column_name and is_class_data_row and row_has_payload:
        mode_time = _row_mode_time(table_ctx, col_idx)
        if mode_time:
            c = Candidate("context", mode_time, 0.62, strict=False)
            c.reason = "context_fill_from_mode_time"
            c.normalized_confidence = 0.62
            candidates.append(c)

    if "subject" in column_name and text:
        left = row_ctx.get("left_cell", "").strip().lower()
        right = row_ctx.get("right_cell", "").strip().lower()
        if "gk" in left or "gk" in right:
            c = Candidate("context", "GK", 0.66, strict=False)
            c.reason = "context_neighbor_subject_hint"
            c.normalized_confidence = 0.66
            candidates.append(c)

    if ("class taught" in column_name or column_name == "class") and text and is_class_data_row:
        prev_class = row_ctx.get("prev_row_class", "").strip().lower()
        if prev_class.endswith("th") and text.isdigit():
            val = int(text)
            if 1 <= val <= 12:
                suffix = "th"
                if val == 1:
                    suffix = "st"
                elif val == 2:
                    suffix = "nd"
                elif val == 3:
                    suffix = "rd"
                c = Candidate("context", f"{val}{suffix}", 0.64, strict=False)
                c.reason = "context_class_sequence_hint"
                c.normalized_confidence = 0.64
                candidates.append(c)

    return candidates
