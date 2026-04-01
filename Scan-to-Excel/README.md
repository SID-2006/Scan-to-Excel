# Scan-to-Excel  
### 🧠 Production-Grade OCR Intelligence for Converting Scanned Documents into Clean, Structured Excel Data

Scan-to-Excel is a full-stack OCR platform that transforms noisy images/PDFs into structured tabular output with confidence-aware correction, human-in-the-loop review, and one-click Excel export.

---

## 📌 Overview

### The Problem
Real-world scanned documents are messy:
- handwriting and spelling noise
- low-contrast photos
- skewed captures
- broken table rows and merged cells
- OCR uncertainty that silently corrupts output

Traditional OCR-only pipelines extract text, but often fail to produce reliable structured data.

### The Solution
Scan-to-Excel combines:
1. **Multi-pass OCR extraction** (original + enhanced image)
2. **Deterministic post-processing rules** for structural recovery
3. **Optional Gemini AI correction** for low-confidence rows
4. **Confidence scoring** (`needs_review`, `low_confidence_rows`)
5. **React-based review UI** for fast manual fixes
6. **Excel export** for operational workflows

This delivers a robust, production-oriented OCR-to-table workflow instead of raw OCR text dumps.

---

## ✨ Key Features

### 1) Universal OCR Ingestion
Accepts both images and PDFs through a unified API flow (`/extract-any`), with bounded PDF page processing for predictable runtime.

### 2) Multi-Pass OCR for Better Recall
Runs OCR on both:
- original source image
- enhanced image (deskew, denoise, contrast improvement)

Then selects/merges candidates to reduce missed handwritten entries.

### 3) Intelligent Table Reconstruction
Supports both generic and daily-report style layouts, with row/column repair and heuristics for broken-row recovery.

### 4) Hybrid Auto-Correction (Rules + AI)
- Rules-first correction for deterministic cleanup
- Gemini escalation only for uncertain rows
- Automatic fallback to local correction if AI fails/unavailable

### 5) Confidence-Aware Review
Every extraction can include:
- `needs_review`: global quality gate
- `low_confidence_rows`: row-level uncertainty indices

The frontend highlights risky rows for targeted human verification.

### 6) Excel Export for Downstream Ops
Cleaned/edited data can be exported directly to `.xlsx` via backend endpoint.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
  A[Client Upload<br/>Image/PDF] --> B[Flask API Layer]
  B --> C[OCR Engine]
  C --> C1[Original Image OCR]
  C --> C2[Enhanced Image OCR]
  C1 --> D[Candidate Merge/Selection]
  C2 --> D
  D --> E[Table Reconstruction]
  E --> F[Rule-Based Auto-Correction]
  F --> G{Low Confidence?}
  G -- Yes --> H[Gemini Correction]
  G -- No --> I[Finalize]
  H --> I[Finalize]
  I --> J[Confidence Metadata<br/>needs_review, low_confidence_rows]
  J --> K[React Review UI]
  K --> L[Manual Edits]
  L --> M[Excel Export (/download)]
```

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| **Backend** | Python, Flask, Flask-CORS, python-dotenv |
| **OCR / CV** | PaddleX, PaddleOCR, PaddlePaddle, OpenCV |
| **Data Processing** | NumPy, Pandas, RapidFuzz |
| **Document / Export** | PyMuPDF, OpenPyXL |
| **AI Correction** | Gemini (REST API with fallback strategy) |
| **Frontend** | React 19, Axios, Framer Motion, Lucide React, Tailwind ecosystem |
| **Dev Tooling** | npm, virtualenv, ESLint (CRA defaults) |

---

## 📁 Project Structure

```text
Scan-to-Excel/
├── Backend/
│   ├── app.py                    # Flask routes and API orchestration
│   ├── ocr_engine.py             # OCR, reconstruction, Excel writer
│   ├── ocr_auto_correction.py    # Rule-based correction + confidence scoring
│   ├── gemini_autocorrect.py     # Gemini integration + fallback logic
│   ├── corrections_vocab.json    # Custom alias dictionary (subject/activity)
│   ├── requirements.txt
│   ├── uploads/                  # Runtime uploaded files
│   └── outputs/                  # Runtime exported Excel files
├── frontend/
│   ├── src/
│   │   ├── components/           # Upload, table review, export UI
│   │   └── App.js                # Main workflow + API integration
│   └── package.json
└── README.md
```

---

## ⚙️ Installation

## 1) Clone Repository
```bash
git clone https://github.com/SID-2006/Scan-to-Excel
cd Scan-to-Excel
```

## 2) Backend Setup (Recommended Python 3.10)
```bash
cd Backend
python3.10 -m venv ../.venv310
source ../.venv310/bin/activate
pip install -r requirements.txt
```

## 3) Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🔐 Configuration

Create `Backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Notes
- If `GEMINI_API_KEY` is missing/invalid, pipeline continues with deterministic fallback.
- For faster startup, run backend with:
  - `PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK=True`

---

## 🚀 Usage

## Start Backend
```bash
cd Backend
source ../.venv310/bin/activate
PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK=True python app.py
```
Backend runs at: `http://127.0.0.1:5001`

## Start Frontend
```bash
cd frontend
npm start
```
Frontend runs at: `http://localhost:3000`

## Typical User Flow
1. Upload image/PDF in frontend
2. Backend extracts + corrects table data
3. Low-confidence rows are highlighted in UI
4. User edits if needed
5. Export final dataset to Excel

---

## 🔌 API Reference

Base URL: `http://127.0.0.1:5001`

### 1) Health Check
### `GET /`
**Response**
```json
{
  "message": "Scan to Excel Backend is running"
}
```

---

### 2) Universal Extraction (Recommended)
### `POST /extract-any`
`multipart/form-data`:
- `file` (required)
- `max_pages` (optional, PDF only, clamped to 1..5)

**Example**
```bash
curl -X POST http://127.0.0.1:5001/extract-any \
  -F "file=@/absolute/path/document.jpg"
```

**Response**
```json
{
  "raw_data": [
    ["..."],
    ["..."]
  ],
  "data": [
    { "Date": "20/02", "Subject": "GK", "Activity": "Reading" }
  ],
  "source": "rules_primary",
  "used_fallback": false,
  "error": null,
  "needs_review": true,
  "low_confidence_rows": [2, 4]
}
```

---

### 3) Raw OCR Extraction
### `POST /upload`
Returns raw extracted table data.

**Response**
```json
{
  "data": [
    ["SN", "Teacher", "In-time", "Out-time"],
    ["1", "Ravi", "6:30", "7:30"]
  ]
}
```

---

### 4) Direct Auto-Correction
### `POST /autocorrect-ocr`
`application/json`

**Request**
```json
{
  "data": [
    ["12/02", "M4th", "H0mework"],
    ["13/02", "Englsh", "Lectur"]
  ]
}
```

**Response**
```json
{
  "data": [
    { "Date": "12/02", "Subject": "Math", "Activity": "Homework" },
    { "Date": "13/02", "Subject": "English", "Activity": "Lecture" }
  ],
  "source": "rules_primary",
  "used_fallback": false,
  "error": null,
  "needs_review": false,
  "low_confidence_rows": []
}
```

---

### 5) Excel Export
### `POST /download`
`application/json`

**Request**
```json
{
  "data": [
    ["Date", "Subject", "Activity"],
    ["12/02", "Math", "Homework"]
  ]
}
```

**Response**
- Binary `.xlsx` file (`output.xlsx`)

---

### 6) Legacy Template Route
### `POST /upload-jte`
Template-specific legacy extraction path retained for compatibility.

---

### 7) Contact Endpoint
### `POST /contact`
Simple contact handler for form submissions.

---

## 🔄 Processing Pipeline (OCR → Correction → Export)

1. **Input Acquisition**  
   Receive image/PDF upload.

2. **Preprocessing**  
   Deskew + denoise + contrast enhancement for OCR robustness.

3. **OCR Extraction**  
   Run OCR on original and enhanced representations.

4. **Candidate Consolidation**  
   Merge/select best OCR candidates.

5. **Table Reconstruction**  
   Convert OCR fragments into row-column structure.

6. **Rule-Based Correction**  
   Normalize dates/text, fix OCR spelling, repair broken rows, apply alias dictionary.

7. **Confidence Scoring**  
   Detect low-confidence rows and set review flags.

8. **Selective AI Escalation**  
   Send uncertain rows to Gemini for contextual correction.

9. **Fallback Safety**  
   If AI fails, preserve deterministic corrected output.

10. **Review + Export**  
   Frontend highlights uncertain rows; final export to Excel.

---

## 🧪 Confidence & Review System

| Signal | Meaning | Consumer |
|---|---|---|
| `needs_review` | At least one risky/uncertain condition detected | Frontend badge / QA workflow |
| `low_confidence_rows` | Specific row indices likely to need human correction | Row highlighting in review table |

This allows teams to prioritize manual checks where it matters most.

---

## 🛡️ Error Handling Strategy

- **Validation Errors**: HTTP `400` with clear `error` message.
- **Processing Errors**: HTTP `500` with failure details.
- **AI Failures**: Non-fatal; automatic fallback to deterministic path.
- **Operational Principle**: Prefer degraded-but-usable output over hard failure.

---

## 🔒 Security & Production Considerations

Current baseline:
- `secure_filename` on uploaded files
- CORS enabled
- Local disk storage for uploads/exports

Recommended production hardening:
1. Restrict CORS to trusted origins
2. Add authN/authZ for write endpoints
3. Enforce upload size limits and MIME checks
4. Use object storage (S3/GCS/Azure Blob) instead of local disk
5. Move secrets to secret manager (Vault/SM/KMS)
6. Add structured logging + request tracing
7. Add rate limiting and abuse controls

---

## ⚡ Performance Notes

| Area | Current Strategy | Tradeoff |
|---|---|---|
| OCR Recall | Multi-pass OCR | Higher CPU/runtime |
| Startup Time | Model initialization/caching | First request latency |
| PDF Processing | `max_pages` cap | Controls cost/latency |
| AI Usage | Low-confidence-only escalation | Reduces token/API spend |

---

## ⚠️ Known Limitations

- Very noisy handwriting may still need manual edits.
- Complex non-grid layouts can degrade reconstruction quality.
- Some frontend lint warnings may exist in unrelated UI areas.
- No built-in auth layer yet for multi-tenant/enterprise use.

---

## 🛣️ Roadmap / Future Improvements

- [ ] Async job queue (Celery/RQ) for long-running OCR tasks
- [ ] Batch upload + bulk export workflows
- [ ] Versioned correction profiles per document type
- [ ] Active-learning feedback loop from user edits
- [ ] Observability: metrics dashboards + distributed tracing
- [ ] Dockerized deployment and IaC templates
- [ ] Role-based access control and audit logs

---

## 🤝 Contributing Guidelines

1. Fork the repository and create a feature branch.
2. Keep PRs focused and atomic.
3. Add/update tests for logic changes.
4. Validate both:
   - daily-report style documents
   - generic tables
5. Update docs/API examples for behavioral changes.
6. Open PR with:
   - problem statement
   - approach
   - before/after evidence (screenshots/sample output)

---

## 📄 License

No explicit `LICENSE` file is currently enforced in this repository.  
Add a license (e.g., MIT/Apache-2.0) before external distribution.

