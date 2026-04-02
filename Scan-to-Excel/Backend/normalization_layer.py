import re
import unicodedata
from typing import Any, Dict, List, Tuple


def _column_name(schema: Any, col_idx: int) -> str:
    if isinstance(schema, dict):
        cols = schema.get("columns", [])
        if col_idx < len(cols):
            return str(cols[col_idx])
    elif isinstance(schema, list) and col_idx < len(schema):
        return str(schema[col_idx])
    return f"col_{col_idx}"


def _is_protected(column_name: str, cfg) -> bool:
    lower = column_name.lower()
    return any(tag in lower for tag in cfg.protected_columns)


def _light_clean(text: str) -> str:
    text = unicodedata.normalize("NFKC", text or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _normalize_generic(text: str) -> str:
    text = unicodedata.normalize("NFKC", text or "")
    text = text.replace("|", " ")
    text = re.sub(r"[^\S\r\n]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _handle_handwritten_numeric(value: str) -> str:
    original = value.strip().upper()
    if not original:
        return ""
        
    replacements = {
        "E": "3", "B": "8", "S": "5", "O": "0", "G": "6",
        "T": "7", "Z": "2", "I": "1", "L": "1"
    }
    # Direct replacement for single character misreads
    if original in replacements:
        return replacements[original]
    
    # Generic numbers-only logic
    return re.sub(r"[^\d]", "", original.replace("B", "8").replace("S", "5").replace("O", "0"))


def _normalize_for_column(text: str, column_name: str) -> str:
    lower = column_name.lower()
    value = _normalize_generic(text)

    if "time" in lower:
        value = value.replace(".", ":")
        value = value.replace("O", "0").replace("o", "0")
        value = re.sub(r"\s+", "", value)
    elif "students" in lower or "count" in lower:
        value = _handle_handwritten_numeric(value) or value
    elif "teacher" in lower or "name" in lower:
        # Restore alphabetic characters that might have been read as numbers
        value = value.replace("3", "e").replace("5", "s").replace("0", "o").replace("8", "b").replace("1", "i")
        value = re.sub(r"[^A-Za-z\s.]", "", value).strip().title()
    elif "subject" in lower:
        value = re.sub(r"[^A-Za-z\s]", "", value)
        value = re.sub(r"\s+", " ", value).strip()
    elif "class taught" in lower or "class" == lower.strip():
        value = value.replace(" ", "")
    return value


def normalize_grid(
    repaired_grid: List[List[str]], schema: Any, cfg, cache
) -> Tuple[List[List[str]], Dict[str, Any]]:
    """
    Normalize text per column and capture transform metadata.
    Protected columns only get light cleaning.
    """
    normalized: List[List[str]] = []
    rows_meta: List[Dict[str, Any]] = []

    for r_idx, row in enumerate(repaired_grid):
        out_row: List[str] = []
        cell_meta: List[Dict[str, Any]] = []
        for c_idx, raw in enumerate(row):
            col_name = _column_name(schema, c_idx)
            raw_text = str(raw or "")

            if _is_protected(col_name, cfg):
                normalized_text = _light_clean(raw_text)
                issues = ["protected_light_clean_only"] if raw_text != normalized_text else []
            else:
                normalized_text = _normalize_for_column(raw_text, col_name)
                issues = ["normalized"] if raw_text != normalized_text else []

            out_row.append(normalized_text)
            cell_meta.append(
                {
                    "column": col_name,
                    "raw_text": raw_text,
                    "normalized_text": normalized_text,
                    "issues": issues,
                }
            )
        normalized.append(out_row)
        rows_meta.append({"row_index": r_idx, "cells": cell_meta})

    return normalized, {"rows": rows_meta}

