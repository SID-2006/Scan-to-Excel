# Scan to Excel

Scan to Excel is a full-stack OCR app that extracts tabular data from scanned images and PDFs, lets you review and correct the detected rows in the browser, and exports the final result as an Excel file.

## What It Does

- Upload scanned images or PDF documents
- Detect table structure using OpenCV
- Extract text using PaddleOCR
- Handle both generic tables and daily report-style forms
- Preview and edit extracted data in the frontend
- Download the cleaned result as an `.xlsx` spreadsheet

## Project Structure

```text
Scan-to-Excel/
├── Backend/
│   ├── app.py
│   ├── ocr_engine.py
│   ├── requirements.txt
│   ├── setup_venv.sh
│   ├── uploads/
│   └── outputs/
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── install_all_dependencies.sh
└── README.md
```

## Tech Stack

### Backend

- Flask
- Flask-CORS
- OpenCV
- PaddleOCR
- PaddlePaddle
- PyMuPDF
- pandas
- NumPy
- openpyxl

### Frontend

- React
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React

## How It Works

1. The user uploads an image or PDF from the React frontend.
2. The Flask backend saves the file and sends it through the OCR pipeline.
3. `ocr_engine.py` preprocesses the document, detects the table area, runs OCR, and reconstructs the extracted rows.
4. The frontend displays the detected table and allows manual correction.
5. The corrected data is posted back to the backend and exported as an Excel file.

## Setup

### Prerequisites

- Python 3.9+ recommended
- Node.js 18+ recommended
- npm

Note: PaddleOCR and PaddlePaddle can be sensitive to Python/platform combinations. If installation fails, use a Python version known to be supported by your Paddle stack.

## Backend Setup

From the `Scan-to-Excel/Backend` directory:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
# macOS / Linux
source venv/bin/activate

# Windows PowerShell
venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Run the backend:

```bash
python app.py
```

The API runs on:

```text
http://127.0.0.1:5001
```

## Frontend Setup

From the `Scan-to-Excel/frontend` directory:

```bash
npm install
npm start
```

The frontend usually runs on:

```text
http://localhost:3000
```

## Full Project Setup

The repo includes helper scripts:

- `install_all_dependencies.sh`
- `Backend/setup_venv.sh`

These scripts are currently written for macOS/Linux style environments and may need adjustment on Windows.

## Environment Notes

The backend supports optional PaddleOCR model path overrides through environment variables:

- `PADDLE_OCR_MODEL_ROOT`
- `PADDLE_OCR_DET_MODEL_DIR`
- `PADDLE_OCR_REC_MODEL_DIR`
- `PADDLE_OCR_LANG`

This is useful if the default Paddle model cache is unavailable or you want to use local model folders.

## API Endpoints

### `GET /`

Health check endpoint.

Response:

```json
{
  "message": "Scan to Excel Backend is running"
}
```

### `POST /upload`

Uploads a file and returns extracted table data.

Accepted input:

- image files
- PDF files

Form fields:

- `file`: uploaded document
- `max_pages`: optional, for PDFs only, clamped between 1 and 5

Response shape:

```json
{
  "data": [["cell 1", "cell 2"]],
  "meta": {
    "warnings": []
  }
}
```

### `POST /download`

Accepts table data and returns an Excel file.

Request body:

```json
{
  "data": [
    ["A1", "B1"],
    ["A2", "B2"]
  ]
}
```

### `GET /test-upload`

Processes the sample image stored in the backend folder and returns extracted data. Useful for quick local testing.

## Supported Input Types

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`
- `.pdf`

## Output

- Extracted table data shown in the browser
- Editable table for manual correction
- Downloadable Excel file saved as `.xlsx`

## Current Behavior Highlights

- Backend defaults to port `5001`
- PDF uploads are processed page by page
- PDF extraction currently processes up to 2 pages by default unless `max_pages` is provided
- The frontend supports in-browser cell editing before export
- The backend applies formatting when generating Excel output

## Known Limitations

- OCR quality depends heavily on scan quality, lighting, skew, and table clarity
- Very complex layouts or low-resolution scans may require manual corrections
- The helper shell scripts are not cross-platform out of the box
- Sample uploads, generated outputs, and debug assets are currently stored in the repository

## Development Notes

- Main backend entrypoint: [Backend/app.py](/f:/CEP/Scan-to-Excel/Scan-to-Excel/Backend/app.py)
- OCR pipeline: [Backend/ocr_engine.py](/f:/CEP/Scan-to-Excel/Scan-to-Excel/Backend/ocr_engine.py)
- Frontend app shell: [frontend/src/App.js](/f:/CEP/Scan-to-Excel/Scan-to-Excel/frontend/src/App.js)

## Future Improvements

- Add Docker support
- Add automated tests for upload and extraction flows
- Add file size and format validation on the backend
- Add better multi-page PDF controls in the UI
- Separate generated files from tracked source assets

## License

Add a license section here if you plan to open-source or distribute the project.
