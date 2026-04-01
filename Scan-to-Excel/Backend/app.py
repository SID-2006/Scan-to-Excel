import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import paddle

# Set Paddle memory flags for production stability
paddle.set_flags({
    "FLAGS_eager_delete_scope": True,
    "FLAGS_fraction_of_cpu_memory_to_use": 0.1,
})

from gemini_autocorrect import autocorrect_with_gemini
from ocr_engine import process_image, process_pdf, save_to_excel

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
load_dotenv(os.path.join(BASE_DIR, ".env"))

@app.route("/", methods=["GET"])
def home():
    return {
        "message": "Scan to Excel Backend is running"
    }

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def _extract_table_from_uploaded_file(file_path, filename, max_pages_raw):
    extension = os.path.splitext(filename)[1].lower()
    if extension == ".pdf":
        try:
            max_pages = int(max_pages_raw or "2")
        except ValueError:
            max_pages = 2
        max_pages = max(1, min(max_pages, 5))
        return process_pdf(file_path, max_pages=max_pages, zoom=1.35)
    return process_image(file_path)


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file or not file.filename:
        return jsonify({"error": "Invalid file"}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({"error": "Invalid filename"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        table = _extract_table_from_uploaded_file(
            file_path=file_path,
            filename=filename,
            max_pages_raw=request.form.get("max_pages", "2"),
        )
        return jsonify({"data": table})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/extract-any", methods=["POST"])
def extract_any():
    """
    Universal OCR route for any image/PDF.
    Flow:
      file -> generic OCR extraction -> auto-correction/structuring (Gemini + local fallback)
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file or not file.filename:
        return jsonify({"error": "Invalid file"}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({"error": "Invalid filename"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        raw_table = _extract_table_from_uploaded_file(
            file_path=file_path,
            filename=filename,
            max_pages_raw=request.form.get("max_pages", "2"),
        )
        corrected = autocorrect_with_gemini(raw_table)
        return jsonify(
            {
                "raw_data": raw_table,
                "data": corrected.get("data", []),
                "source": corrected.get("source", "rules_fallback"),
                "used_fallback": bool(corrected.get("used_fallback", True)),
                "error": corrected.get("error"),
                "needs_review": bool(corrected.get("needs_review", False)),
                "low_confidence_rows": corrected.get("low_confidence_rows", []),
            }
        )
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


@app.route("/autocorrect-ocr", methods=["POST"])
def autocorrect_ocr():
    payload = request.get_json(silent=True) or {}
    ocr_data = payload.get("data")

    if ocr_data is None:
        return jsonify({"error": "No OCR data provided. Pass it in JSON as {\"data\": ...}"}), 400

    result = autocorrect_with_gemini(ocr_data)
    return jsonify(result)


@app.route("/upload-jte", methods=["POST"])
def upload_file_jte():
    """
    Legacy, template-specific route.
    Returns corrected rows + metadata + generated excel path.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file or not file.filename:
        return jsonify({"error": "Invalid file"}), 400

    filename = secure_filename(file.filename)
    if not filename:
        return jsonify({"error": "Invalid filename"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    try:
        from end_to_end_jte_pipeline import run_end_to_end_table_extraction

        excel_path = os.path.join(OUTPUT_FOLDER, "jte_output.xlsx")
        corrected_rows, metadata, generated_excel_path = run_end_to_end_table_extraction(
            file_path,
            output_excel_path=excel_path,
            cfg={"DEBUG": False},
        )
        return jsonify(
            {
                "data": corrected_rows,
                "metadata": metadata,
                "excel_path": generated_excel_path,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/contact", methods=["POST"])
def contact():
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"error": "Please provide name, email, and message"}), 400

    # In a real app, you would send an email or save to a database here
    print(f"Contact Form Submission: From {name} ({email}): {message}")

    return jsonify({"message": "Success! Your message has been sent."}), 200

@app.route("/test-upload")
def test_upload():
    base_dir = os.path.dirname(__file__)
    image_path = os.path.join(base_dir, "sample.png")

    table = process_image(image_path)
    return {"data": table}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
