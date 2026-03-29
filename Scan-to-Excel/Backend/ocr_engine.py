import cv2
import pandas as pd
import numpy as np
import os
import tempfile
from paddleocr import PaddleOCR

# Disable oneDNN to fix Windows crash
os.environ["FLAGS_use_mkldnn"] = "0"

# Initialize PaddleOCR once (expensive to load)
ocr = PaddleOCR(use_angle_cls=True, lang='en', enable_mkldnn=False)


# ─── STEP 1: PREPROCESS IMAGE ───────────────────────────────────────────────────

def preprocess_image(image):
    """Convert to grayscale for line detection."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return gray


# ─── STEP 2: DETECT TABLE GRID LINES ────────────────────────────────────────────

def detect_table_lines(gray):
    """Detect horizontal and vertical lines to find the table grid."""
    # Binary threshold for line detection
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    img_h, img_w = thresh.shape

    # Horizontal lines
    h_kernel_len = max(img_w // 8, 40)
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (h_kernel_len, 1))
    horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)

    # Vertical lines
    v_kernel_len = max(img_h // 8, 40)
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, v_kernel_len))
    vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, vertical_kernel, iterations=2)

    return horizontal, vertical


# ─── STEP 3: FIND ROW AND COLUMN BOUNDARIES ─────────────────────────────────────

def find_boundaries(line_mask, axis):
    """
    Find boundaries from a line mask.
    axis=1 for rows (sum across columns), axis=0 for columns (sum across rows).
    """
    sums = np.sum(line_mask, axis=axis)
    threshold = np.max(sums) * 0.3 if np.max(sums) > 0 else 0

    line_positions = np.where(sums > threshold)[0]

    if len(line_positions) == 0:
        return []

    # Cluster nearby positions into single boundaries
    boundaries = []
    cluster_start = line_positions[0]

    for i in range(1, len(line_positions)):
        if line_positions[i] - line_positions[i - 1] > 3:
            boundaries.append((cluster_start + line_positions[i - 1]) // 2)
            cluster_start = line_positions[i]

    boundaries.append((cluster_start + line_positions[-1]) // 2)

    return sorted(boundaries)


# ─── STEP 4: OCR THE FULL IMAGE, THEN MAP TO GRID ───────────────────────────────

def ocr_full_image(image_path):
    """
    Run PaddleOCR on the full image and return list of (text, center_x, center_y).
    This is MUCH more accurate than cropping tiny cells and OCR-ing each separately.
    """
    results = []

    try:
        predictions = list(ocr.predict(image_path))
        for pred in predictions:
            # OCRResult is dict-like with rec_texts and dt_polys
            rec_texts = None
            dt_polys = None

            # Try attribute access first, then dict access
            if hasattr(pred, 'rec_texts'):
                rec_texts = pred.rec_texts
                dt_polys = pred.dt_polys
            elif isinstance(pred, dict):
                rec_texts = pred.get('rec_texts', [])
                dt_polys = pred.get('dt_polys', [])

            if rec_texts and dt_polys is not None:
                for text, poly in zip(rec_texts, dt_polys):
                    poly = np.array(poly)
                    cx = float(np.mean(poly[:, 0]))
                    cy = float(np.mean(poly[:, 1]))
                    results.append((text.strip(), cx, cy))
    except Exception as e:
        import traceback
        print(f"[WARN] PaddleOCR predict failed: {e}")
        traceback.print_exc()

    return results



def assign_text_to_grid(ocr_results, row_bounds, col_bounds):
    """
    Map each OCR text result to the correct grid cell based on its center position.
    Returns a 2D list (rows × cols) of text strings.
    """
    num_rows = len(row_bounds) - 1
    num_cols = len(col_bounds) - 1

    # Initialize empty grid
    grid = [["" for _ in range(num_cols)] for _ in range(num_rows)]

    for text, cx, cy in ocr_results:
        if not text.strip():
            continue

        # Find which row this text belongs to
        row_idx = -1
        for r in range(num_rows):
            if row_bounds[r] <= cy <= row_bounds[r + 1]:
                row_idx = r
                break

        # Find which column this text belongs to
        col_idx = -1
        for c in range(num_cols):
            if col_bounds[c] <= cx <= col_bounds[c + 1]:
                col_idx = c
                break

        if row_idx >= 0 and col_idx >= 0:
            # Append text if cell already has content (rare)
            if grid[row_idx][col_idx]:
                grid[row_idx][col_idx] += " " + text
            else:
                grid[row_idx][col_idx] = text

    return grid


def fix_merged_cells(grid):
    """
    Fix cells where OCR merged adjacent column values.
    e.g. '2DS' in Species col with empty Plot col → Plot='2', Species='DS'
    e.g. '2 DM' in Species col with empty Plot col → Plot='2', Species='DM'
    """
    import re

    for row in grid:
        for col_idx in range(1, len(row)):
            cell = row[col_idx].strip()
            prev_cell = row[col_idx - 1].strip()

            # If previous cell is empty and this cell starts with a digit followed by text
            if prev_cell == "" and cell:
                # Pattern: "2DS" or "2 DS" or "2DM" or "2 DM"
                match = re.match(r'^(\d+)\s*([A-Za-z].*)$', cell)
                if match:
                    row[col_idx - 1] = match.group(1)
                    row[col_idx] = match.group(2)

    return grid


# ─── STEP 5: VALIDATE AND CLEAN ──────────────────────────────────────────────────

def validate_and_clean(table):
    """Clean OCR artifacts and remove empty rows."""
    if not table:
        return table

    cleaned = []

    for row in table:
        cleaned_row = []
        for cell in row:
            text = cell.strip()

            # Remove common OCR noise
            for char in ["|", "]", "[", "\\", "{", "}", "~", "`"]:
                text = text.replace(char, "")

            # Fix common OCR mistakes
            text = text.replace("l/", "1/")    # date fix
            text = text.replace("O/", "0/")    # date fix

            cleaned_row.append(text.strip())

        # Skip completely empty rows
        if any(cell.strip() for cell in cleaned_row):
            cleaned.append(cleaned_row)

    return cleaned


# ─── STEP 6: NORMALIZE COLUMNS ──────────────────────────────────────────────────

def normalize_columns(table):
    """Ensure all rows have the same number of columns."""
    if not table:
        return table

    max_cols = max(len(row) for row in table)

    normalized = []
    for row in table:
        while len(row) < max_cols:
            row.append("")
        normalized.append(row[:max_cols])

    return normalized


# ─── FALLBACK: FULL-IMAGE OCR WITHOUT GRID ───────────────────────────────────────

def fallback_full_image_ocr(image_path):
    """
    Fallback when grid lines aren't detected.
    Use PaddleOCR on the full image and group by Y-position into rows.
    """
    ocr_results = ocr_full_image(image_path)

    if not ocr_results:
        return []

    # Sort by y then x
    ocr_results.sort(key=lambda r: (r[2], r[1]))

    # Group into rows by Y proximity
    rows = []
    current_row = []
    current_y = None
    row_threshold = 15

    for text, cx, cy in ocr_results:
        if current_y is None:
            current_y = cy

        if abs(cy - current_y) <= row_threshold:
            current_row.append((cx, text))
        else:
            rows.append(current_row)
            current_row = [(cx, text)]
            current_y = cy

    if current_row:
        rows.append(current_row)

    # Sort each row by x position
    table = []
    for row in rows:
        row.sort(key=lambda item: item[0])
        table.append([cell[1] for cell in row])

    return table


# ─── MAIN PIPELINE ───────────────────────────────────────────────────────────────

def process_image(image_path):
    """
    Full pipeline:
    Scanned document → preprocess → detect table structure →
    segment rows/columns/cells → OCR full image → map to grid →
    validate → reconstruct
    """
    # Load image
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Image not found: {image_path}")

    # Step 1: Preprocess
    gray = preprocess_image(image)
    img_h, img_w = gray.shape

    # Step 2: Detect table grid lines
    horizontal, vertical = detect_table_lines(gray)

    # Step 3: Find row and column boundaries
    row_bounds = find_boundaries(horizontal, axis=1)
    col_bounds = find_boundaries(vertical, axis=0)

    # Step 4: OCR the full image (much better than per-cell OCR)
    ocr_results = ocr_full_image(image_path)

    if len(row_bounds) >= 3 and len(col_bounds) >= 3 and ocr_results:
        # Map OCR results to grid cells
        table = assign_text_to_grid(ocr_results, row_bounds, col_bounds)
        # Fix merged cells (e.g. "2DM" → "2" + "DM")
        table = fix_merged_cells(table)
    elif ocr_results:
        # Fallback: group OCR results by Y-position
        print("[INFO] Grid lines not fully detected, grouping by position...")
        table = fallback_full_image_ocr(image_path)
    else:
        table = []

    # Step 5: Validate and clean
    table = validate_and_clean(table)

    # Step 6: Normalize columns
    table = normalize_columns(table)

    return table


# ─── SAVE TO EXCEL ───────────────────────────────────────────────────────────────

def save_to_excel(table, output_path):
    """Save the validated table to an Excel file."""
    df = pd.DataFrame(table)
    df.to_excel(output_path, index=False, header=False)