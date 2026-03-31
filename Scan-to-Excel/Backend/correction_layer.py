from collections import Counter
from typing import Any, Dict, List, Tuple

from arbitration_engine import apply_confidence_pipeline, arbitrate, prune_candidates
from cache import LRUCorrectionCache
from config import resolve_config
from context_correction import generate_context_candidates
from deterministic_rules import Candidate, candidate_to_dict, generate_deterministic_candidates
from grid_validation import validate_and_repair_grid
from normalization_layer import normalize_grid
from validation_gate import final_validation_gate, validate_candidate


def _column_name(schema: Any, col_idx: int) -> str:
    if isinstance(schema, dict):
        cols = schema.get("columns", [])
        if col_idx < len(cols):
            return str(cols[col_idx])
    elif isinstance(schema, list) and col_idx < len(schema):
        return str(schema[col_idx])
    return f"col_{col_idx}"


def _original_candidate(text: str) -> Candidate:
    c = Candidate("original", text, 0.90, strict=False)
    c.reason = "original_text"
    c.normalized_confidence = 0.90
    return c


def _build_table_context(normalized_grid: List[List[str]]) -> Dict[str, Any]:
    return {"normalized_grid": normalized_grid}


def _row_context(normalized_grid: List[List[str]], r_idx: int, c_idx: int) -> Dict[str, Any]:
    row = normalized_grid[r_idx]
    left_cell = row[c_idx - 1] if c_idx > 0 else ""
    right_cell = row[c_idx + 1] if c_idx + 1 < len(row) else ""
    prev_row_class = ""
    if r_idx > 0 and c_idx < len(normalized_grid[r_idx - 1]):
        prev_row_class = normalized_grid[r_idx - 1][c_idx]
    first_cell = (row[0] if row else "").strip()
    is_class_data_row = first_cell.isdigit() and (1 <= int(first_cell) <= 8)
    row_payload_cells = row[1:] if len(row) > 1 else []
    row_has_payload = any((cell or "").strip() for cell in row_payload_cells)
    return {
        "row_index": r_idx,
        "col_index": c_idx,
        "left_cell": left_cell,
        "right_cell": right_cell,
        "prev_row_class": prev_row_class,
        "is_class_data_row": is_class_data_row,
        "row_has_payload": row_has_payload,
    }


def _context_agreement_texts(candidates: List[Candidate]) -> set:
    det = {c.text for c in candidates if c.source == "deterministic"}
    ctx = {c.text for c in candidates if c.source == "context"}
    return det.intersection(ctx)


def _prepare_ml_candidates(
    ml_predictor,
    short_list: List[Candidate],
    column_name: str,
    row_ctx: Dict[str, Any],
    table_ctx: Dict[str, Any],
) -> List[Candidate]:
    if ml_predictor is None:
        return []
    # Candidate shortlist text payload for predictor.
    text_options = [c.text for c in short_list if c.text]
    try:
        prediction = ml_predictor(text_options, column_name, row_ctx, table_ctx)
    except Exception:
        return []

    out: List[Candidate] = []
    if isinstance(prediction, dict):
        text = str(prediction.get("text", "")).strip()
        conf = float(prediction.get("confidence", 0.0))
        if text:
            c = Candidate("ml", text, conf, strict=False)
            c.reason = "ml_predictor_single"
            c.normalized_confidence = conf
            out.append(c)
    elif isinstance(prediction, tuple) and len(prediction) >= 2:
        text = str(prediction[0]).strip()
        conf = float(prediction[1])
        if text:
            c = Candidate("ml", text, conf, strict=False)
            c.reason = "ml_predictor_tuple"
            c.normalized_confidence = conf
            out.append(c)
    elif isinstance(prediction, list):
        for item in prediction:
            if isinstance(item, dict):
                text = str(item.get("text", "")).strip()
                conf = float(item.get("confidence", 0.0))
            elif isinstance(item, tuple) and len(item) >= 2:
                text = str(item[0]).strip()
                conf = float(item[1])
            else:
                continue
            if text:
                c = Candidate("ml", text, conf, strict=False)
                c.reason = "ml_predictor_list"
                c.normalized_confidence = conf
                out.append(c)
    return out


def run_correction_engine(
    grid_rows,
    schema,
    row_confidences=None,
    ml_predictor=None,
    cfg=None,
) -> Tuple[List[List[str]], Dict[str, Any]]:
    """
    Production OCR correction engine with strict pipeline ordering.
    """
    config = resolve_config(cfg)
    cache = LRUCorrectionCache(config.cache_max_size)
    warm_entries = [
        (("subject", pattern.lower(), "deterministic"), pattern)
        for pattern in config.cache_warmup_patterns
    ]
    cache.warmup(warm_entries)

    metadata: Dict[str, Any] = {
        "failsafe_triggered": False,
        "failsafe_reason": None,
        "invalid_rows_ratio": 0.0,
        "grid_repair_failed": False,
        "pipeline_trace": [],
        "rows": [],
    }

    # 1) Grid validation & repair
    repaired_grid, grid_meta = validate_and_repair_grid(grid_rows, schema, config)
    metadata["pipeline_trace"].append("1_grid_validation_and_repair")
    metadata["grid_repair_failed"] = bool(grid_meta.get("grid_repair_failed", False))

    # 2) Normalization
    normalized_grid, norm_meta = normalize_grid(repaired_grid, schema, config, cache)
    metadata["pipeline_trace"].append("2_normalization")

    table_ctx = _build_table_context(normalized_grid)
    corrected_grid = [row[:] for row in normalized_grid]

    # setup row meta with required fields
    for r_idx, row in enumerate(normalized_grid):
        metadata["rows"].append(
            {
                "row_status": grid_meta.get("row_status_by_row", {}).get(r_idx, "ok"),
                "issues": [],
                "confidence_penalty": float(
                    grid_meta.get("confidence_penalty_by_row", {}).get(r_idx, 0.0)
                ),
                "cells": [],
            }
        )

    # 3-11) Per-cell processing chain
    metadata["pipeline_trace"].append("3_context_aware_correction")
    metadata["pipeline_trace"].append("4_deterministic_rules")
    metadata["pipeline_trace"].append("5_candidate_tracking")
    metadata["pipeline_trace"].append("6_candidate_pruning")
    metadata["pipeline_trace"].append("7_optional_ml")
    metadata["pipeline_trace"].append("8_confidence_pipeline")
    metadata["pipeline_trace"].append("9_arbitration_tie_break")
    metadata["pipeline_trace"].append("10_confidence_floor")
    metadata["pipeline_trace"].append("11_final_validation_gate")

    for r_idx, row in enumerate(normalized_grid):
        row_penalty = float(grid_meta.get("confidence_penalty_by_row", {}).get(r_idx, 0.0))
        for c_idx, value in enumerate(row):
            col_name = _column_name(schema, c_idx)
            row_ctx = _row_context(normalized_grid, r_idx, c_idx)
            cell_ctx = {
                "row_idx": r_idx,
                "col_idx": c_idx,
                "column_name": col_name,
                "text": value,
                "is_class_data_row": bool(row_ctx.get("is_class_data_row", False)),
                "row_confidence": (
                    float(row_confidences[r_idx])
                    if row_confidences and r_idx < len(row_confidences)
                    else 1.0
                ),
            }

            candidates: List[Candidate] = []

            # 5) Candidate tracking starts with original candidate first (mandatory)
            original = _original_candidate(value)
            candidates.append(original)

            # 3) Context candidates
            context_candidates = generate_context_candidates(cell_ctx, row_ctx, table_ctx, config, cache)
            candidates.extend(context_candidates)

            # 4) Deterministic candidates
            deterministic_candidates = generate_deterministic_candidates(cell_ctx, config, cache)
            candidates.extend(deterministic_candidates)

            # 6) Prune BEFORE ML / heavy scoring
            debug_meta = {}
            pruned_candidates, pruned_count = prune_candidates(candidates, config, debug_meta)

            # 7) Optional ML after pruning only
            if config.ENABLE_ML and ml_predictor is not None:
                ml_candidates = _prepare_ml_candidates(
                    ml_predictor, pruned_candidates, col_name, row_ctx, table_ctx
                )
                pruned_candidates.extend(ml_candidates)

            # 8) Confidence pipeline strict order
            agreement = _context_agreement_texts(pruned_candidates)
            scored = apply_confidence_pipeline(pruned_candidates, row_penalty, agreement, config)

            # 9 + 10) Arbitration + tie-break + floor
            winner = arbitrate(scored, config)

            # 11) Final validation and fallback
            sorted_candidates = sorted(scored, key=lambda x: x.final_score, reverse=True)
            selected = final_validation_gate(sorted_candidates, col_name, row_ctx, config)
            corrected_grid[r_idx][c_idx] = selected.text

            rejected = []
            for cand in sorted_candidates:
                if cand.rejected:
                    _, reason = validate_candidate(cand, col_name, row_ctx, config)
                    rejected.append({**candidate_to_dict(cand), "reject_reason": reason or cand.reason})

            # record row issues for visibility
            if selected.source != "original":
                metadata["rows"][r_idx]["issues"].append(f"{col_name}_corrected")
            if selected.source != winner.source:
                metadata["rows"][r_idx]["issues"].append(f"{col_name}_fallback_selected")

            scoring_breakdown = [
                {
                    "source": c.source,
                    "text": c.text,
                    "breakdown": getattr(c, "scoring_breakdown", {}),
                }
                for c in sorted_candidates
            ]

            metadata["rows"][r_idx]["cells"].append(
                {
                    "column": col_name,
                    "candidates": [candidate_to_dict(c) for c in sorted_candidates],
                    "pruned_count": pruned_count,
                    "scoring_breakdown": scoring_breakdown,
                    "rejected_candidates": rejected,
                    "selected_source": selected.source,
                    "selected_text": selected.text,
                }
            )

    # 12) Global fail-safe check
    metadata["pipeline_trace"].append("12_global_failsafe")
    total_rows = len(normalized_grid) if normalized_grid else 1
    invalid_rows = len(grid_meta.get("invalid_row_indices", []))
    invalid_ratio = invalid_rows / total_rows
    metadata["invalid_rows_ratio"] = float(invalid_ratio)

    failsafe = False
    if invalid_ratio >= config.FAILSAFE_INVALID_ROW_RATIO:
        failsafe = True
        metadata["failsafe_reason"] = "invalid_rows_ratio_exceeded"
    elif metadata["grid_repair_failed"]:
        failsafe = True
        metadata["failsafe_reason"] = "grid_repair_failed"

    metadata["failsafe_triggered"] = failsafe

    # 13) Output + metadata
    metadata["pipeline_trace"].append("13_output_metadata")
    if failsafe:
        return normalized_grid, metadata
    return corrected_grid, metadata
