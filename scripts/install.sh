#!/bin/bash
set -e

# Create directory for your scripts
mkdir -p /var/lib/homebridge/broadlink-s3-python

# Copy your scripts over
cp broadlink-s3-python/get-all-subdevices.py /var/lib/homebridge/broadlink-s3-python/get-all-subdevices.py
cp broadlink-s3-python/get-device-state.py /var/lib/homebridge/broadlink-s3-python/get-device-state.py
cp broadlink-s3-python/set-device-state.py /var/lib/homebridge/broadlink-s3-python/set-device-state.py

# Set up virtual environment path
VENV_DIR="/var/lib/homebridge/broadlink-s3-python/venv"

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
fi

# Activate the virtual environment
source "$VENV_DIR/bin/activate"

# Install broadlink inside the virtual environment
pip install --upgrade pip  # optional, but good practice
pip install broadlink

# Deactivate the virtual environment
deactivate

echo "Installation complete"
