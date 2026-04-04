# Scan to Excel

> Turn scanned tables, forms, and PDFs into editable spreadsheet data.

Scan to Excel is a full-stack OCR application that extracts tabular data from scanned images and PDF documents, lets you review and correct the output in the browser, and exports the cleaned result as an Excel file.

## Overview

```text
Upload document -> detect table -> run OCR -> review/edit data -> export .xlsx
```

### Highlights

- Supports image and PDF uploads
- Detects table structure using OpenCV
- Extracts text using PaddleOCR
- Reconstructs both generic tables and daily report-style forms
- Lets users correct OCR output before export
- Generates formatted `.xlsx` files

## Demo Flow

1. Upload a scanned image or PDF.
2. The backend detects the document and table layout.
3. OCR extracts text from the detected regions.
4. The frontend shows the extracted table in an editable view.
5. You download the corrected data as an Excel spreadsheet.

## Features

| Feature | Description |
| --- | --- |
| OCR extraction | Reads printed table content from scanned files |
| Table reconstruction | Maps OCR results back into rows and columns |
| PDF support | Converts PDF pages into images and extracts page by page |
| Editable preview | Lets users manually fix cells before export |
| Excel export | Downloads cleaned data as `.xlsx` |
| Daily report handling | Includes logic for structured daily report forms |

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

## Architecture

### Backend flow

- [app.py](/f:/CEP/Scan-to-Excel/Scan-to-Excel/Backend/app.py) exposes the API endpoints
- [ocr_engine.py](/f:/CEP/Scan-to-Excel/Scan-to-Excel/Backend/ocr_engine.py) runs the OCR and table extraction pipeline
- Extracted data is saved as Excel through `openpyxl`

### Frontend flow

- [App.js](/f:/CEP/Scan-to-Excel/Scan-to-Excel/frontend/src/App.js) coordinates upload, processing, preview, and download
- Users can inspect extracted data and correct individual cells before export

## Quick Start

### Prerequisites

- Python 3.9+ recommended
- Node.js 18+ recommended
- npm

Note: PaddleOCR and PaddlePaddle can be sensitive to Python and platform compatibility. If installation fails, use a Python version supported by your Paddle setup.

### 1. Start the backend

From `Scan-to-Excel/Backend`:

```bash
python -m venv venv
```

Activate the environment:

```bash
# macOS / Linux
source venv/bin/activate

# Windows PowerShell
venv\Scripts\Activate.ps1
```

Install dependencies and run:

```bash
pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

Backend URL:

```text
http://127.0.0.1:5001
```

### 2. Start the frontend

From `Scan-to-Excel/frontend`:

```bash
npm install
npm start
```

Frontend URL:

```text
http://localhost:3000
```

## Helper Scripts

The repository includes:

- `install_all_dependencies.sh`
- `Backend/setup_venv.sh`

These scripts are currently written for macOS/Linux-style environments and may need adjustment on Windows.

## Environment Variables

The backend supports optional PaddleOCR model overrides:

- `PADDLE_OCR_MODEL_ROOT`
- `PADDLE_OCR_DET_MODEL_DIR`
- `PADDLE_OCR_REC_MODEL_DIR`
- `PADDLE_OCR_LANG`

Use these if the default Paddle model cache is unavailable or if you want to point the app at local model directories.

## API

### `GET /`

Health check endpoint.

```json
{
  "message": "Scan to Excel Backend is running"
}
```

### `POST /upload`

Uploads a document and returns extracted table data.

Accepted files:

- images
- PDFs

Form fields:

- `file`: uploaded document
- `max_pages`: optional for PDF uploads, clamped between 1 and 5

Response:

```json
{
  "data": [["cell 1", "cell 2"]],
  "meta": {
    "warnings": []
  }
}
```

### `POST /download`

Accepts extracted table data and returns an Excel file.

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

Processes the sample backend image and returns extracted data for quick local testing.

## Supported File Types

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`
- `.pdf`

## Output

- Browser-based table preview
- Inline cell editing for OCR corrections
- Downloadable `.xlsx` spreadsheet

## Current Behavior

- Backend runs on port `5001`
- PDF uploads are processed page by page
- PDFs default to processing up to `2` pages unless `max_pages` is provided
- Frontend supports in-browser editing before export
- Excel output is generated with basic formatting

## Limitations

- OCR quality depends on scan quality, skew, contrast, and table clarity
- Complex or low-resolution documents may still need manual correction
- Helper shell scripts are not fully cross-platform
- Sample files, generated outputs, and debug assets are currently present in the repository

## Future Improvements

- Add Docker support
- Add automated tests for upload and extraction flows
- Add stricter backend file validation
- Add richer multi-page PDF controls in the UI
- Move generated and debug artifacts out of tracked source folders

## License

MIT License
