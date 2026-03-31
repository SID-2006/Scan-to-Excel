from typing import Any, Dict, List, Tuple


def _expected_width(grid_rows: List[List[str]], schema: Any) -> int:
    if isinstance(schema, dict):
        cols = schema.get("columns")
        if isinstance(cols, list) and cols:
            return len(cols)
    if isinstance(schema, list) and schema:
        return len(schema)
    return max((len(row) for row in grid_rows), default=0)


def validate_and_repair_grid(
    grid_rows: List[List[str]], schema: Any, cfg
) -> Tuple[List[List[str]], Dict[str, Any]]:
    """
    Enforce stable table shape and emit repair quality metadata.
    Never raises; always returns a usable grid.
    """
    rows = grid_rows or []
    target_width = _expected_width(rows, schema)
    repaired: List[List[str]] = []
    invalid_row_indices: List[int] = []
    confidence_penalty_by_row: Dict[int, float] = {}
    row_status_by_row: Dict[int, str] = {}

    if target_width <= 0:
        return [], {
            "grid_repair_failed": True,
            "invalid_row_indices": [],
            "confidence_penalty_by_row": {},
            "row_status_by_row": {},
        }

    for r_idx, row in enumerate(rows):
        original = list(row) if isinstance(row, list) else []
        row_list = original[:]
        issues = 0

        if len(row_list) < target_width:
            issues += target_width - len(row_list)
            row_list.extend([""] * (target_width - len(row_list)))
        elif len(row_list) > target_width:
            issues += len(row_list) - target_width
            row_list = row_list[:target_width]

        non_empty = sum(1 for c in row_list if str(c).strip())
        if non_empty == 0:
            invalid_row_indices.append(r_idx)
            row_status_by_row[r_idx] = "invalid"
            confidence_penalty_by_row[r_idx] = 0.35
        elif non_empty <= max(1, target_width // 4):
            row_status_by_row[r_idx] = "repaired"
            confidence_penalty_by_row[r_idx] = min(0.30, 0.05 * max(issues, 1))
        else:
            row_status_by_row[r_idx] = "ok" if issues == 0 else "repaired"
            confidence_penalty_by_row[r_idx] = min(0.25, 0.03 * issues)

        repaired.append([str(cell) if cell is not None else "" for cell in row_list])

    invalid_ratio = (len(invalid_row_indices) / len(repaired)) if repaired else 1.0
    grid_repair_failed = invalid_ratio >= 0.80

    return repaired, {
        "grid_repair_failed": grid_repair_failed,
        "invalid_row_indices": invalid_row_indices,
        "confidence_penalty_by_row": confidence_penalty_by_row,
        "row_status_by_row": row_status_by_row,
    }

