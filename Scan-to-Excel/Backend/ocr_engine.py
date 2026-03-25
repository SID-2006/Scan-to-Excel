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


import cv2
import pytesseract
import pandas as pd

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def process_image(image_path):
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Image not found")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    thresh = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    # 🔥 Improved OCR with position data
    data = pytesseract.image_to_data(
        thresh,
        output_type=pytesseract.Output.DATAFRAME
    )

    # Clean text safely
    data = data.dropna(subset=['text'])
    data = data[data['text'].str.strip() != ""]

    # If nothing detected, return empty table
    if data.empty:
        return []

    # Group words into rows using Y position
    data['row'] = (data['top'] / 15).astype(int)

    grouped = data.groupby('row')

    table = []

    for _, row in grouped:
        row = row.sort_values('left')
        words = row['text'].tolist()
        table.append(words)

    return table


def save_to_excel(table, output_path):
    df = pd.DataFrame(table)
    df.to_excel(output_path, index=False, header=False)