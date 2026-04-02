from dataclasses import dataclass, field
from typing import Dict, List, Set, Tuple


@dataclass
class EngineConfig:
    """Runtime config for OCR correction engine."""

    MAX_CANDIDATES: int = 5
    SOURCE_PRIORITIES: Dict[str, float] = field(
        default_factory=lambda: {
            "deterministic": 1.0,
            "context": 0.8,
            "ml": 0.7,
            "original": 0.6,
        }
    )
    TIE_MARGIN: float = 0.05
    CONFIDENCE_FLOOR: float = 0.5
    CONTEXT_BOOST: float = 0.1
    FAILSAFE_INVALID_ROW_RATIO: float = 0.5
    ENABLE_ML: bool = False
    DEBUG: bool = False

    # Column-specific handling.
    protected_columns: Set[str] = field(
        default_factory=lambda: {
            "volunteer/teacher's name",
            "volunteer/teacher name",
            "name",
            "teacher name",
        }
    )
    # (min, max) bounds.
    student_count_range: Tuple[int, int] = (1, 200)
    valid_subjects: List[str] = field(
        default_factory=lambda: ["Marathi", "GK", "Basic", "Maths", "English"]
    )
    valid_class_ordinals: List[str] = field(
        default_factory=lambda: [
            "1st",
            "2nd",
            "3rd",
            "4th",
            "5th",
            "6th",
            "7th",
            "8th",
            "9th",
            "10th",
            "11th",
            "12th",
        ]
    )

    # Confidence calibration by source.
    # normalized = a * raw + b, clamped [0, 1]
    source_calibration: Dict[str, Tuple[float, float]] = field(
        default_factory=lambda: {
            "deterministic": (1.05, -0.02),
            "context": (0.90, 0.02),
            "ml": (0.80, 0.05),
            "original": (1.00, 0.00),
        }
    )

    # Cache config and warmup examples.
    cache_max_size: int = 512
    cache_warmup_patterns: List[str] = field(
        default_factory=lambda: ["maathi", "ak", "630", "7.4O"]
    )


def resolve_config(cfg=None) -> EngineConfig:
    """Allow None, EngineConfig, or dict-style overrides."""
    if cfg is None:
        return EngineConfig()
    if isinstance(cfg, EngineConfig):
        return cfg
    if isinstance(cfg, dict):
        base = EngineConfig()
        for key, value in cfg.items():
            if hasattr(base, key):
                setattr(base, key, value)
        return base
    return EngineConfig()

