import sys;
import broadlink;

host = sys.argv[1];
did = sys.argv[2];
switchIndex = sys.argv[3];

# print(host.partition(',')[0]);
# print(did);
device = broadlink.hello(host.partition(',')[0]);
device.auth();
print(device.get_state(did=did)[switchIndex]);

sys.stdout.flush();