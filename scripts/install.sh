#!/bin/bash 
mkdir /var/lib/homebridge/broadlink-s3-python
cp broadlink-s3-python/get-all-subdevices.py /var/lib/homebridge/broadlink-s3-python/get-all-subdevices.py
cp broadlink-s3-python/get-device-state.py /var/lib/homebridge/broadlink-s3-python/get-device-state.py
cp broadlink-s3-python/set-device-state.py /var/lib/homebridge/broadlink-s3-python/set-device-state.py
pip3 install --upgrade broadlink