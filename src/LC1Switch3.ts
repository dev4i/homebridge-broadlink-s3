import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { ExampleHomebridgePlatform } from './platform';
import child_process = require('child_process');
/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class LC1Switch3 {
  private serviceSwitchOne: Service;
  private serviceSwitchTwo: Service;
  private serviceSwitchThree: Service;
  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private states = {
    pwr1: this.accessory.context.device.status.pwr1 !== void 0 ? this.accessory.context.device.status.pwr1 : null,
    pwr2: this.accessory.context.device.status.pwr2 !== void 0 ? this.accessory.context.device.status.pwr2 : null,
    pwr3: this.accessory.context.device.status.pwr3 !== void 0 ? this.accessory.context.device.status.pwr3 : null,
  };

  constructor(private readonly platform: ExampleHomebridgePlatform, private readonly accessory: PlatformAccessory) {
    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the Switch service if it exists, otherwise create a new Switch service
    // you can create multiple services for each accessory
    this.serviceSwitchOne =
      this.accessory.getService('Switch One') ||
      this.accessory.addService(this.platform.Service.Switch, 'Switch One', this.accessory.context.device.did + '-1');

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.serviceSwitchOne.setCharacteristic(this.platform.Characteristic.Name, 'Switch One');

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the On/Off Characteristic
    this.serviceSwitchOne
      .getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this)) // SET - bind to the `setOn` method below
      .onGet(this.getOn.bind(this)); // GET - bind to the `getOn` method below

    this.serviceSwitchTwo =
      this.accessory.getService('Switch Two') ||
      this.accessory.addService(this.platform.Service.Switch, 'Switch Two', this.accessory.context.device.did + '-2');

    this.serviceSwitchTwo.setCharacteristic(this.platform.Characteristic.Name, 'Switch Two');

    this.serviceSwitchTwo
      .getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setTwoOn.bind(this))
      .onGet(this.getTwoOn.bind(this));

    this.serviceSwitchThree =
      this.accessory.getService('Switch Three') ||
      this.accessory.addService(this.platform.Service.Switch, 'Switch Three', this.accessory.context.device.did + '-3');

    this.serviceSwitchThree.setCharacteristic(this.platform.Characteristic.Name, 'Switch Three');

    this.serviceSwitchThree
      .getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setThreeOn.bind(this))
      .onGet(this.getThreeOn.bind(this));
    /**
     * Creating multiple services of the same type.
     *
     * To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
     * when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
     * this.accessory.getService('NAME') || this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE_ID');
     *
     * The USER_DEFINED_SUBTYPE must be unique to the platform accessory (if you platform exposes multiple accessories, each accessory
     * can use the same sub type id.)
     */
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setOn(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    // this.states.On = value as boolean;

    const intValue = (value as boolean) === true ? 1 : 0;
    const pythonProcess = child_process.spawn(
      'python3',
      [
        'broadlink-s3-python/set-device-state.py',
        this.accessory.context.device.host,
        this.accessory.context.device.uniqueId,
        intValue,
        'pwr1',
      ],
      { shell: true },
    );

    pythonProcess.stdout.on('data', (data) => {
      this.platform.log.info('Python output:');
      this.platform.log.info(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      this.platform.log.error('Python error:');
      this.platform.log.error(data.toString());
    });

    this.platform.log.debug('Set Characteristic On ->', value);
  }

  async setTwoOn(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    // this.states.On = value as boolean;

    const intValue = (value as boolean) === true ? 1 : 0;
    const pythonProcess = child_process.spawn(
      'python3',
      [
        'broadlink-s3-python/set-device-state.py',
        this.accessory.context.device.host,
        this.accessory.context.device.uniqueId,
        intValue,
        'pwr2',
      ],
      { shell: true },
    );

    pythonProcess.stdout.on('data', (data) => {
      this.platform.log.info('Python output:');
      this.platform.log.info(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      this.platform.log.error('Python error:');
      this.platform.log.error(data.toString());
    });

    this.platform.log.debug('Set Characteristic On ->', value);
  }

  async setThreeOn(value: CharacteristicValue) {
    // implement your own code to turn your device on/off
    // this.states.On = value as boolean;

    const intValue = (value as boolean) === true ? 1 : 0;
    const pythonProcess = child_process.spawn(
      'python3',
      [
        'broadlink-s3-python/set-device-state.py',
        this.accessory.context.device.host,
        this.accessory.context.device.uniqueId,
        intValue,
        'pwr3',
      ],
      { shell: true },
    );

    pythonProcess.stdout.on('data', (data) => {
      this.platform.log.info('Python output:');
      this.platform.log.info(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      this.platform.log.error('Python error:');
      this.platform.log.error(data.toString());
    });

    this.platform.log.debug('Set Characteristic On ->', value);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getOn(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    // const isOn = this.states.On;

    const pythonProcess = child_process.spawn(
      'python3',
      [
        'broadlink-s3-python/get-device-state.py',
        this.accessory.context.device.host,
        this.accessory.context.device.uniqueId,
        'pwr1',
      ],
      { shell: true },
    );

    return await new Promise((resolve) => {
      pythonProcess.stdout.on('data', (data) => {
        this.platform.log.info('Python output:');
        const response = data.toString();
        if (response.trim() === '1') {
          this.platform.log.debug('Get Characteristic On ->', true);
          resolve(true);
        }
        if (response.trim() === '0') {
          this.platform.log.debug('Get Characteristic On ->', false);
          resolve(false);
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        this.platform.log.error('Python error:');
        this.platform.log.error(data.toString());
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      });
    });
  }

  async getTwoOn(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    // const isOn = this.states.On;

    const pythonProcess = child_process.spawn(
      'python3',
      [
        'broadlink-s3-python/get-device-state.py',
        this.accessory.context.device.host,
        this.accessory.context.device.uniqueId,
        'pwr2',
      ],
      { shell: true },
    );

    return await new Promise((resolve) => {
      pythonProcess.stdout.on('data', (data) => {
        this.platform.log.info('Python output:');
        const response = data.toString();
        if (response.trim() === '1') {
          this.platform.log.debug('Get Characteristic On ->', true);
          resolve(true);
        }
        if (response.trim() === '0') {
          this.platform.log.debug('Get Characteristic On ->', false);
          resolve(false);
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        this.platform.log.error('Python error:');
        this.platform.log.error(data.toString());
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      });
    });
  }

  async getThreeOn(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on
    // const isOn = this.states.On;

    const pythonProcess = child_process.spawn(
      'python3',
      [
        'broadlink-s3-python/get-device-state.py',
        this.accessory.context.device.host,
        this.accessory.context.device.uniqueId,
        'pwr3',
      ],
      { shell: true },
    );

    return await new Promise((resolve) => {
      pythonProcess.stdout.on('data', (data) => {
        this.platform.log.info('Python output:');
        const response = data.toString();
        if (response.trim() === '1') {
          this.platform.log.debug('Get Characteristic On ->', true);
          resolve(true);
        }
        if (response.trim() === '0') {
          this.platform.log.debug('Get Characteristic On ->', false);
          resolve(false);
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        this.platform.log.error('Python error:');
        this.platform.log.error(data.toString());
        throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      });
    });
  }
}
