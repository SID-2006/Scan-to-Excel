#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Full Stack Dependency Installation..."

# 1. Backend Setup
echo "--------------------------------------------------------"
echo "📦 Setting up Backend (Python)..."
cd "$(dirname "$0")/Backend"

# Create/Update virtual environment using system Python 3.9 (recommended for PaddleOCR)
PYTHON_PATH="/Library/Developer/CommandLineTools/usr/bin/python3"
VENV_DIR="venv"

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    $PYTHON_PATH -m venv $VENV_DIR
else
    echo "Virtual environment already exists."
fi

# Activate and Install
source $VENV_DIR/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 2. Frontend Setup
echo "--------------------------------------------------------"
echo "📦 Setting up Frontend (Node.js/React)..."
cd "../frontend"

# Install npm dependencies
npm install

echo "--------------------------------------------------------"
echo "✅ SUCCESS: All dependencies for Backend and Frontend are installed."
echo "--------------------------------------------------------"
echo "To run the backend: cd Backend && source venv/bin/activate && python app.py"
echo "To run the frontend: cd frontend && npm start"
echo "--------------------------------------------------------"
