# import cv2
# import pytesseract
# import pandas as pd

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# def process_image(image_path):
#     image = cv2.imread(image_path)

#     if image is None:
#         raise ValueError("Image not found")

#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     thresh = cv2.adaptiveThreshold(
#         gray, 255,
#         cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#         cv2.THRESH_BINARY,
#         11, 2
#     )

#     text = pytesseract.image_to_string(thresh)

#     lines = text.strip().split("\n")
#     table = []

#     for line in lines:
#         if line.strip():
#             table.append(line.split())

#     return table


# def save_to_excel(table, output_path):
#     df = pd.DataFrame(table)
#     df.to_excel(output_path, index=False, header=False)



# import cv2
# import pytesseract
# import pandas as pd
# import numpy as np

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# def process_image(image_path):
#     image = cv2.imread(image_path)

#     if image is None:
#         raise ValueError("Image not found")

#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # Binary image
#     _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

#     # Detect horizontal lines
#     horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
#     detect_horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel)

#     # Detect vertical lines
#     vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
#     detect_vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, vertical_kernel)

#     # Combine lines
#     table_mask = detect_horizontal + detect_vertical

#     # Find contours
#     contours = cv2.findContours(
#         table_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE
#     )
#     contours = contours[0] if len(contours) == 2 else contours[1]

#     # 🔥 Sort contours by row then column
#     def sort_contours(contours):
#         bounding_boxes = [cv2.boundingRect(c) for c in contours]
#         contours, bounding_boxes = zip(*sorted(
#             zip(contours, bounding_boxes),
#             key=lambda b: (b[1][1], b[1][0])
#         ))
#         return contours

#     contours = sort_contours(contours)

#     cells = []

#     for cnt in contours:
#         x, y, w, h = cv2.boundingRect(cnt)

#         # 🔥 keep small cells (important)
#         if w < 20 or h < 10:
#             continue

#         cell = image[y:y+h, x:x+w]

#         if cell.size == 0:
#             continue

#         # 🔥 better OCR for cell
#         text = pytesseract.image_to_string(
#             cell,
#             config='--psm 7 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/'
#         )

#         cells.append((y, x, text.strip()))

#     # Sort by row and column
#     cells = sorted(cells, key=lambda x: (x[0], x[1]))

#     # 🔥 Proper row grouping
#     table = []
#     current_row = []
#     current_y = None
#     row_threshold = 15

#     for y, x, text in cells:

#         if current_y is None:
#             current_y = y

#         if abs(y - current_y) <= row_threshold:
#             current_row.append((x, text))
#         else:
#             current_row = sorted(current_row, key=lambda item: item[0])
#             table.append([t[1] for t in current_row])

#             current_row = [(x, text)]
#             current_y = y

#     # last row
#     if current_row:
#         current_row = sorted(current_row, key=lambda item: item[0])
#         table.append([t[1] for t in current_row])

#     return table


# def save_to_excel(table, output_path):
#     df = pd.DataFrame(table)
#     df.to_excel(output_path, index=False, header=False)


import cv2
import pytesseract
import pandas as pd
import numpy as np

# Path to Tesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def process_image(image_path):
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Image not found")

    # 🔹 Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 🔹 Threshold (invert for line detection)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # 🔹 Detect table lines
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))

    detect_horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel)
    detect_vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, vertical_kernel)

    table_mask = detect_horizontal + detect_vertical

    # 🔹 Find contours (cells)
    contours = cv2.findContours(table_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = contours[0] if len(contours) == 2 else contours[1]

    cells = []

    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)

        # Remove noise
        if w < 20 or h < 10:
            continue

        cell = image[y:y+h, x:x+w]

        if cell.size == 0:
            continue

        # 🔥 OCR per cell
        text = pytesseract.image_to_string(cell, config='--psm 7').strip()

        # 🔥 Fix common OCR mistakes
        text = text.replace("ai", "1")
        text = text.replace("Mo", "M")
        text = text.replace("|", "")
        text = text.replace("]", "")
        text = text.replace("[", "")

        cells.append((x, y, text))

    # 🔹 Sort cells top-to-bottom, left-to-right
    cells = sorted(cells, key=lambda x: (x[1], x[0]))

    # 🔹 Group into rows
    rows = []
    current_row = []
    current_y = None
    row_threshold = 15

    for x, y, text in cells:
        if current_y is None:
            current_y = y

        if abs(y - current_y) <= row_threshold:
            current_row.append((x, text))
        else:
            rows.append(current_row)
            current_row = [(x, text)]
            current_y = y

    if current_row:
        rows.append(current_row)

    # 🔥 FORCE FIXED 5 COLUMNS
    table = []

    for row in rows:
        row = sorted(row, key=lambda item: item[0])

        # Take only first 5 values
        row_values = [cell[1] for cell in row[:5]]

        # Fill missing columns
        while len(row_values) < 5:
            row_values.append("")

        table.append(row_values)

    return table


def save_to_excel(table, output_path):
    df = pd.DataFrame(table)
    df.to_excel(output_path, index=False, header=False)
    df = pd.DataFrame(table)
    df.to_excel(output_path, index=False, header=False)