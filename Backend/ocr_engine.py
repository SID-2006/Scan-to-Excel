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

    text = pytesseract.image_to_string(thresh)

    lines = text.strip().split("\n")
    table = []

    for line in lines:
        if line.strip():
            table.append(line.split())

    return table


def save_to_excel(table, output_path):
    df = pd.DataFrame(table)
    df.to_excel(output_path, index=False, header=False)
