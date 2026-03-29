# Configuration
VENV_DIR="venv"
PYTHON_PATH="/Library/Developer/CommandLineTools/usr/bin/python3" # Absolute path to 3.9.6

echo "Creating virtual environment using $PYTHON_PATH..."
$PYTHON_PATH -m venv $VENV_DIR

if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment."
    exit 1
fi

echo "Activating virtual environment..."
source $VENV_DIR/bin/activate

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing requirements from requirements.txt..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "--------------------------------------------------------"
    echo "SUCCESS: Virtual environment 'venv' is ready."
    echo "To use it in your terminal, run: source venv/bin/activate"
    echo "To use it in VS Code, select 'venv/bin/python' as interpreter."
    echo "--------------------------------------------------------"
else
    echo "Error: Failed to install one or more requirements."
    exit 1
fi
