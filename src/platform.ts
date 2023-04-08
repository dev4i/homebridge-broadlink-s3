import {
	API,
	DynamicPlatformPlugin,
	Logger,
	PlatformAccessory,
	PlatformConfig,
	Service,
	Characteristic,
} from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { LC1Switch3 } from './LC1Switch3';
import { LC1Switch2 } from './LC1Switch2';
import { LC1Switch1 } from './LC1Switch1';
import child_process = require('child_process');

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class ExampleHomebridgePlatform implements DynamicPlatformPlugin {
	public readonly Service: typeof Service = this.api.hap.Service;
	public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

	// this is used to track restored cached accessories
	public readonly accessories: PlatformAccessory[] = [];

	constructor(public readonly log: Logger, public readonly config: PlatformConfig, public readonly api: API) {
		this.log.debug('Finished initializing platform:', this.config.name);

		// When this event is fired it means Homebridge has restored all cached accessories from disk.
		// Dynamic Platform plugins should only register new accessories after this event was fired,
		// in order to ensure they weren't added to homebridge already. This event can also be used
		// to start discovery of new accessories.
		this.api.on('didFinishLaunching', () => {
			log.debug('Executed didFinishLaunching callback');
			// run the method to discover / register your devices as accessories

			this.discoverDevices();
			const rediscover = () => {
				//Rediscovering devices every 15 minutes
				setTimeout(() => {
					this.discoverDevices();
					rediscover();
				}, 900000);
			};
			rediscover();

		});
	}

	/**
	 * This function is invoked when homebridge restores cached accessories from disk at startup.
	 * It should be used to setup event handlers for characteristics and update respective values.
	 */
	configureAccessory(accessory: PlatformAccessory) {
		this.log.info('Loading accessory from cache:', accessory.displayName);

		// add the restored accessory to the accessories cache so we can track if it has already been registered
		this.accessories.push(accessory);
	}

	/**
	 * This is an example method showing how to register discovered accessories.
	 * Accessories must only be registered once, previously created accessories
	 * must not be registered again to prevent "duplicate UUID" errors.
	 */
	discoverDevices() {
		// Remove all accessories function
		// this.accessories.map((acc) => {
		//   this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [acc]);
		//   this.log.info('Removing existing accessory from cache:', acc.displayName);
		// });

		// it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
		// remove platform accessories when no longer present
		// this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
		// this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);

		const pythonProcess = child_process.spawn('python3', ['broadlink-s3-python/get-all-subdevices.py'], {
			shell: true,
		});

		pythonProcess.stdout.on('data', (data) => {
			this.log.info('Get subdevices python output:');
			this.log.info(data.toString());

			const allSubdevices = JSON.parse(data.toString()).map((dev) => {
				return { uniqueId: dev.did, deviceName: dev.name, host: dev.host, status: dev.status };
			});

			let deviceIndex = 0;

			// loop over the discovered devices and register each one if it has not already been registered
			for (const device of allSubdevices) {
				// generate a unique id for the accessory this should be generated from
				// something globally unique, but constant, for example, the device serial
				// number or MAC address
				const uuid = this.api.hap.uuid.generate(device.uniqueId);

				// see if an accessory with the same uuid has already been registered and restored from
				// the cached devices we stored in the `configureAccessory` method above
				const existingAccessory = this.accessories.find((accessory) => accessory.UUID === uuid);

				if (existingAccessory) {
					//I think LC1 Switches are called simpfc_cli?
					if (device.deviceName === 'simpfc_cli') {
						// the accessory already exists
						this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

						// if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
						existingAccessory.context.device = device;
						this.api.updatePlatformAccessories([existingAccessory]);

						// create the accessory handler for the restored accessory
						// this is imported from `platformAccessory.ts`
						if (device.status.pwr1 !== void 0 && device.status.pwr2 !== void 0 && device.status.pwr3 !== void 0) {
							//This is the three gang switch
							new LC1Switch3(this, existingAccessory);
						} else if (
							device.status.pwr1 !== void 0 &&
							device.status.pwr2 !== void 0 &&
							device.status.pwr3 === void 0
						) {
							//This is the two gang switch
							new LC1Switch2(this, existingAccessory);
						} else if (
							device.status.pwr1 !== void 0 &&
							device.status.pwr2 === void 0 &&
							device.status.pwr3 === void 0
						) {
							//This is the one gang switch
							new LC1Switch1(this, existingAccessory);
						}
					} else {
						this.log.error('Device not recognised:');
						this.log.error(device);
					}
				} else {
					//I think LC1 Switches are called simpfc_cli?
					if (device.deviceName === 'simpfc_cli') {
						// the accessory does not yet exist, so we need to create it
						this.log.info('Adding new accessory: ', device.deviceName);
						this.log.info('accessory: ', JSON.stringify(device));
						let accessory;

						if (device.status.pwr1 !== void 0 && device.status.pwr2 !== void 0 && device.status.pwr3 !== void 0) {
							//This is the three gang switch
							accessory = new this.api.platformAccessory(deviceIndex + '_LC1 Switch 3 Gang', uuid);
							accessory.context.device = device;
							new LC1Switch3(this, accessory);
						} else if (
							device.status.pwr1 !== void 0 &&
							device.status.pwr2 !== void 0 &&
							device.status.pwr3 === void 0
						) {
							//This is the two gang switch
							accessory = new this.api.platformAccessory(deviceIndex + '_LC1 Switch 2 Gang', uuid);
							accessory.context.device = device;
							new LC1Switch2(this, accessory);
						} else if (
							device.status.pwr1 !== void 0 &&
							device.status.pwr2 === void 0 &&
							device.status.pwr3 === void 0
						) {
							//This is the one gang switch
							accessory = new this.api.platformAccessory(deviceIndex + '_LC1 Switch 1 Gang', uuid);
							accessory.context.device = device;
							new LC1Switch1(this, accessory);
						}

						deviceIndex++;

						// link the accessory to your platform
						if (accessory === void 0) {
							this.log.error('The type of device was not detectable');
							this.log.error(JSON.stringify(device));
						} else {
							this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
						}
					} else {
						this.log.error('Device not recognised:');
						this.log.error(device);
					}
				}
			}
		});

		pythonProcess.stderr.on('data', (data) => {
			this.log.error('Device Discovery Python Error:');
			this.log.error(data.toString());
		});
	}
}
