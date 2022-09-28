import sys;
import broadlink;
import json;

devices = broadlink.discover();
listOfDeviceIds = [];
for device in devices:
    device.auth()
    for subdevice in device.get_subdevices():
        subdevice['host'] = device.host
        subdevice['status'] = device.get_state(did=subdevice['did'])
        listOfDeviceIds.append(subdevice)
        # print(subdevice);
print(json.dumps(listOfDeviceIds));
sys.stdout.flush();
