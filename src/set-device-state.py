import sys;
import broadlink;

host = sys.argv[1];
did = sys.argv[2];
payload = int(sys.argv[3]);
switchIndex = sys.argv[4];

print(host.partition(',')[0]);
print(did);
print(payload);
device = broadlink.hello(host.partition(',')[0]);
device.auth();
if switchIndex == 'pwr1':
    print('set device pwr1')
    print(device.set_state(did=did, pwr1=payload));
if switchIndex == 'pwr2':
    print('set device pwr2')
    print(device.set_state(did=did, pwr2=payload));
if switchIndex == 'pwr3':
    print('set device pwr3')
    print(device.set_state(did=did, pwr3=payload));

sys.stdout.flush();