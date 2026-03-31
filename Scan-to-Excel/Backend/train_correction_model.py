import argparse
import os
from typing import List, Tuple

from cache import LRUCorrectionCache
from config import resolve_config
from correction_layer import _column_name
from deterministic_rules import generate_deterministic_candidates
from ml_text_corrector import save_model
from ocr_engine import process_image


def build_training_pairs(image_paths: List[str]) -> Tuple[List[str], List[str], List[dict]]:
    """
    Build weakly supervised pairs from OCR outputs:
    input  = noisy cell text
    target = deterministic corrected text
    """
    cfg = resolve_config({"ENABLE_ML": False, "DEBUG": False})
    cache = LRUCorrectionCache(cfg.cache_max_size)

    x_texts: List[str] = []
    y_labels: List[str] = []
    rows_meta: List[dict] = []

    for image_path in image_paths:
        if not os.path.exists(image_path):
            rows_meta.append({"image": image_path, "status": "missing"})
            continue

        try:
            table = process_image(image_path)
        except Exception as exc:
            rows_meta.append({"image": image_path, "status": f"failed:{exc}"})
            continue

        if not table:
            rows_meta.append({"image": image_path, "status": "empty"})
            continue

        # Use header row if present, otherwise synthetic schema.
        schema = table[5] if len(table) > 6 else [f"col_{i}" for i in range(max(len(r) for r in table))]

        pair_count = 0
        for r_idx, row in enumerate(table):
            is_class_data_row = bool(row and row[0].strip().isdigit())
            for c_idx, text in enumerate(row):
                raw = (text or "").strip()
                if not raw:
                    continue
                col_name = _column_name(schema, c_idx)
                cell_ctx = {
                    "row_idx": r_idx,
                    "col_idx": c_idx,
                    "column_name": col_name,
                    "text": raw,
                    "is_class_data_row": is_class_data_row,
                    "row_confidence": 1.0,
                }
                candidates = generate_deterministic_candidates(cell_ctx, cfg, cache)
                if not candidates:
                    continue

                best = sorted(candidates, key=lambda c: c.raw_confidence, reverse=True)[0]
                if best.text and best.text != raw:
                    feat = f"{col_name.lower()} || {raw}"
                    x_texts.append(feat)
                    y_labels.append(best.text)
                    pair_count += 1

        rows_meta.append({"image": image_path, "status": "ok", "pairs": pair_count})

    # Manual seed pairs to stabilize common OCR errors.
    seeds = [
        ("subject", "maathi", "Marathi"),
        ("subject", "marati", "Marathi"),
        ("subject", "ak", "GK"),
        ("subject", "ck", "GK"),
        ("class taught", "228", "2nd"),
        ("class taught", "1", "1st"),
        ("class taught", "2", "2nd"),
        ("class taught", "3", "3rd"),
        ("in-time", "630", "6:30"),
        ("out-time", "740", "7:40"),
    ]
    for col, src, tgt in seeds:
        x_texts.append(f"{col} || {src}")
        y_labels.append(tgt)

    return x_texts, y_labels, rows_meta


def train_and_save(image_paths: List[str], output_model_path: str) -> None:
    try:
        from sklearn.feature_extraction.text import CountVectorizer
        from sklearn.linear_model import LogisticRegression
    except Exception as exc:
        raise RuntimeError(
            "scikit-learn is required for training. Install with: pip install scikit-learn"
        ) from exc

    x_texts, y_labels, rows_meta = build_training_pairs(image_paths)
    if len(x_texts) < 8:
        raise RuntimeError(f"Not enough training pairs to train model. pairs={len(x_texts)}")

    vectorizer = CountVectorizer(ngram_range=(1, 3), lowercase=True, min_df=1)
    x = vectorizer.fit_transform(x_texts)

    clf = LogisticRegression(max_iter=400, multi_class="auto")
    clf.fit(x, y_labels)

    metadata = {
        "num_pairs": len(x_texts),
        "num_classes": len(set(y_labels)),
        "images": rows_meta,
    }
    save_model(output_model_path, vectorizer, clf, metadata=metadata)

    print(f"Model saved: {output_model_path}")
    print(f"Pairs: {metadata['num_pairs']} | Classes: {metadata['num_classes']}")
    for item in rows_meta:
        print(item)


def main():
    parser = argparse.ArgumentParser(description="Train OCR correction model from scanned images")
    parser.add_argument("images", nargs="+", help="Image paths")
    parser.add_argument(
        "--output",
        default=os.path.join(os.path.dirname(__file__), "models", "ocr_text_corrector.pkl"),
        help="Output model path",
    )
    args = parser.parse_args()
    train_and_save(args.images, args.output)


if __name__ == "__main__":
    main()
