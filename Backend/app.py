from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from ocr_engine import process_image, save_to_excel

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return {
        "message": "Scan to Excel Backend is running"
    }

BASE_DIR = os.path.dirname(__file__)

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(image_path)

    try:
        table = process_image(image_path)
        return jsonify({"data": table})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download", methods=["POST"])
def download_excel():
    table = request.json.get("data")

    if not table:
        return jsonify({"error": "No data provided"}), 400

    output_path = os.path.join(OUTPUT_FOLDER, "output.xlsx")
    save_to_excel(table, output_path)

    return send_file(output_path, as_attachment=True)


import os

@app.route("/test-upload")
def test_upload():
    base_dir = os.path.dirname(__file__)
    image_path = os.path.join(base_dir, "sample.png")

    table = process_image(image_path)
    return {"data": table}


if __name__ == "__main__":
    app.run(debug=True)
