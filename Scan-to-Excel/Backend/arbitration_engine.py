from typing import Any, Dict, List, Tuple

from deterministic_rules import Candidate


SOURCE_RANK = {"deterministic": 0, "context": 1, "original": 2, "ml": 3}


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def calibrate_confidence(source: str, raw_confidence: float, cfg) -> float:
    a, b = cfg.source_calibration.get(source, (1.0, 0.0))
    return _clamp01(a * float(raw_confidence) + b)


def prune_candidates(
    candidates: List[Candidate], cfg, debug_meta: Dict[str, Any]
) -> Tuple[List[Candidate], int]:
    """
    MUST run before ML:
    1) preserve original
    2) preserve strict deterministic
    3) sort remaining by normalized_confidence desc
    4) keep top N
    """
    if not candidates:
        return [], 0

    original = [c for c in candidates if c.source == "original"]
    strict_det = [c for c in candidates if c.source == "deterministic" and c.strict]

    preserved_ids = {id(c) for c in original + strict_det}
    others = [c for c in candidates if id(c) not in preserved_ids]
    others.sort(key=lambda c: float(c.normalized_confidence), reverse=True)

    remaining_slots = max(0, cfg.MAX_CANDIDATES - len(original) - len(strict_det))
    kept = original + strict_det + others[:remaining_slots]
    pruned_count = max(0, len(candidates) - len(kept))

    debug_meta["pruned_count"] = pruned_count
    return kept, pruned_count


def apply_confidence_pipeline(
    candidates: List[Candidate],
    row_decay_penalty: float,
    context_agreement_texts: set,
    cfg,
) -> List[Candidate]:
    """
    STRICT ORDER:
    1. raw_confidence
    2. source calibration
    3. row decay
    4. context boost
    5. priority weighting
    6. final_score
    """
    decay_multiplier = _clamp01(1.0 - float(row_decay_penalty))
    for c in candidates:
        raw = _clamp01(c.raw_confidence)
        calibrated = calibrate_confidence(c.source, raw, cfg)
        after_decay = _clamp01(calibrated * decay_multiplier)
        after_boost = after_decay
        if c.text in context_agreement_texts:
            after_boost = _clamp01(after_boost + cfg.CONTEXT_BOOST)
        weighted = after_boost * float(cfg.SOURCE_PRIORITIES.get(c.source, 1.0))

        c.normalized_confidence = calibrated
        c.final_score = weighted
        c.scoring_breakdown = {
            "raw": raw,
            "calibrated": calibrated,
            "decay_multiplier": decay_multiplier,
            "after_decay": after_decay,
            "after_boost": after_boost,
            "weighted": weighted,
            "final": weighted,
        }
    return candidates


def _best_original(candidates: List[Candidate]) -> Candidate:
    originals = [c for c in candidates if c.source == "original"]
    if originals:
        return originals[0]
    # fallback if invariant broken
    return max(candidates, key=lambda c: c.final_score)


def arbitrate(candidates: List[Candidate], cfg) -> Candidate:
    valid = [c for c in candidates if not c.rejected]
    if not valid:
        return _best_original(candidates)

    # Strict deterministic cannot be overridden.
    strict_det = [c for c in valid if c.source == "deterministic" and c.strict]
    if strict_det:
        winner = max(strict_det, key=lambda c: c.final_score)
    else:
        ordered = sorted(valid, key=lambda c: c.final_score, reverse=True)
        winner = ordered[0]
        if len(ordered) > 1:
            runner_up = ordered[1]
            if abs(winner.final_score - runner_up.final_score) < cfg.TIE_MARGIN:
                rank_w = SOURCE_RANK.get(winner.source, 99)
                rank_r = SOURCE_RANK.get(runner_up.source, 99)
                if rank_r < rank_w:
                    winner = runner_up

    # Confidence floor fallback to original.
    if winner.final_score < cfg.CONFIDENCE_FLOOR:
        winner = _best_original(candidates)
    return winner

