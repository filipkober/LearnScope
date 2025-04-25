#!/bin/bash

# Exit on error
set -e

echo "Starting Flask backend installation..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Flask and other dependencies
echo "Installing Flask and dependencies..."
pip install flask

echo "Installation complete! The virtual environment is now activated."
echo "You can start developing your Flask application."
echo "To deactivate the virtual environment, type 'deactivate'"

