#!/bin/bash
set -e

mkdir -p /var/lib/homebridge/broadlink-s3-python
cp broadlink-s3-python/get-all-subdevices.py /var/lib/homebridge/broadlink-s3-python/get-all-subdevices.py
cp broadlink-s3-python/get-device-state.py /var/lib/homebridge/broadlink-s3-python/get-device-state.py
cp broadlink-s3-python/set-device-state.py /var/lib/homebridge/broadlink-s3-python/set-device-state.py
# Try pip3, fall back to pip
if command -v pip3 &> /dev/null; then
    pip3 install --upgrade broadlink
elif command -v pip &> /dev/null; then
    pip install --upgrade broadlink
else
    echo "Error: pip or pip3 not found."
    exit 1
fi