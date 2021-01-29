import { IPConnection, BrickletAmbientLight, BrickletAmbientLightV2, BrickletAmbientLightV3, BrickletBarometer, BrickletBarometerV2, BrickletHumidity, BrickletHumidityV2, BrickletTemperature, BrickletTemperatureV2 } from 'tinkerforge';
import { BrickletData } from '../interfaces/bricklet-data';
import { connect } from './ipcon-connect';

/**
 * Find and define Bricklet uid's
 *
 * @param {BrickletData} brickletData UID array with versions
 * @param {string} uid Bricklet uid
 * @param {string} deviceIdentifier Bricklet deviceIdentifier
 */
function defineBricklet(brickletData: BrickletData, uid: string, deviceIdentifier: string): void {
	switch (deviceIdentifier) {
		case BrickletAmbientLight.DEVICE_IDENTIFIER:
			brickletData.LIGHT = brickletData.LIGHT ? brickletData.LIGHT : { UID: uid, VERSION: 1 };
			break;

		case BrickletAmbientLightV2.DEVICE_IDENTIFIER:
			brickletData.LIGHT = brickletData.LIGHT.VERSION < 2 ? { UID: uid, VERSION: 2 } : brickletData.LIGHT;
			break;

		case BrickletAmbientLightV3.DEVICE_IDENTIFIER:
			brickletData.LIGHT = { UID: uid, VERSION: 3 };
			break;

		case BrickletBarometer.DEVICE_IDENTIFIER:
			brickletData.BARO = brickletData.BARO ? brickletData.BARO : { UID: uid, VERSION: 1 };
			break;

		case BrickletBarometerV2.DEVICE_IDENTIFIER:
			brickletData.BARO = { UID: uid, VERSION: 2 };
			break;

		case BrickletHumidity.DEVICE_IDENTIFIER:
			brickletData.HUMI = brickletData.HUMI ? brickletData.HUMI : { UID: uid, VERSION: 1 };
			break;

		case BrickletHumidityV2.DEVICE_IDENTIFIER:
			brickletData.HUMI = { UID: uid, VERSION: 2 };
			break;

		case BrickletTemperature.DEVICE_IDENTIFIER:
			brickletData.TEMP = brickletData.TEMP ? brickletData.TEMP : { UID: uid, VERSION: 1 };
			break;

		case BrickletTemperatureV2.DEVICE_IDENTIFIER:
			brickletData.TEMP = { UID: uid, VERSION: 2 };
			break;

		default:
			break;
	}
}

/**
 * Define Tinkerforge Bricklet uids
 *
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 * @returns {string[]} UID Array
 */
export async function getUids(host: string, port: number): Promise<BrickletData> {
	return new Promise(resolve => {
		const ipcon = new IPConnection();
		const brickletData: BrickletData = {};
		connect(ipcon, host, port);
		ipcon.on(IPConnection.CALLBACK_CONNECTED, () => {
			ipcon.enumerate();
		});
		ipcon.on(IPConnection.CALLBACK_ENUMERATE, (uid: string, _connectedUid, _position, _hardwareVersion, _firmwareVersion, deviceIdentifier: string) => {
			defineBricklet(brickletData, uid, deviceIdentifier);
		});
		setTimeout(() => {
			ipcon.disconnect();
			resolve(brickletData);
		}, 50);
	});
}
