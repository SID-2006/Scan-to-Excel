import os
import pickle
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class PredictorResult:
    text: str
    confidence: float


class SklearnTextCorrector:
    """
    Lightweight OCR text correction model wrapper.
    Trained as multiclass text classifier over correction labels.
    """

    def __init__(self, vectorizer, model):
        self.vectorizer = vectorizer
        self.model = model

    @staticmethod
    def _features(text: str, column_name: str) -> str:
        return f"{(column_name or '').lower()} || {text or ''}"

    def predict_one(self, text: str, column_name: str) -> PredictorResult:
        feat = self._features(text, column_name)
        x = self.vectorizer.transform([feat])
        probs = self.model.predict_proba(x)[0]
        idx = int(probs.argmax())
        label = self.model.classes_[idx]
        conf = float(probs[idx])
        return PredictorResult(text=str(label), confidence=conf)

    def predict(
        self,
        text_options: List[str],
        column_name: str,
        row_ctx: Optional[Dict[str, Any]] = None,
        table_ctx: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Compatible with correction_layer._prepare_ml_candidates.
        Returns a single best candidate across text options.
        """
        if not text_options:
            return {"text": "", "confidence": 0.0}

        best_text = ""
        best_conf = -1.0
        for option in text_options:
            pred = self.predict_one(option, column_name)
            if pred.confidence > best_conf:
                best_conf = pred.confidence
                best_text = pred.text
        return {"text": best_text, "confidence": max(0.0, best_conf)}


def save_model(model_path: str, vectorizer, model, metadata: Optional[Dict[str, Any]] = None) -> None:
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    payload = {
        "vectorizer": vectorizer,
        "model": model,
        "metadata": metadata or {},
    }
    with open(model_path, "wb") as f:
        pickle.dump(payload, f)


def load_model(model_path: str) -> Optional[SklearnTextCorrector]:
    if not os.path.exists(model_path):
        return None
    try:
        with open(model_path, "rb") as f:
            payload = pickle.load(f)
        return SklearnTextCorrector(payload["vectorizer"], payload["model"])
    except Exception:
        return None
