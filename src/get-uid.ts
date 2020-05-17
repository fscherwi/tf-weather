import {IPConnection, BrickletAmbientLight, BrickletAmbientLightV2, BrickletAmbientLightV3, BrickletBarometer, BrickletBarometerV2, BrickletHumidity, BrickletHumidityV2, BrickletTemperature, BrickletTemperatureV2} from 'tinkerforge';
import {connect} from './ipcon-connect';

const ipcon = new IPConnection();
const uidArray: any = [];

/**
 * Find and define Bricklet
 *
 * @param {string} uid Bricklet uid
 * @param {string} deviceIdentifier Bricklet deviceIdentifier
 */
function defineBricklet(uid: string, deviceIdentifier: string) {
	switch (deviceIdentifier) {
		case BrickletAmbientLight.DEVICE_IDENTIFIER:
			uidArray.LIGHT = uid;
			break;

		case BrickletAmbientLightV2.DEVICE_IDENTIFIER:
			uidArray.LIGHTV2 = uid;
			break;

		case BrickletAmbientLightV3.DEVICE_IDENTIFIER:
			uidArray.LIGHTV3 = uid;
			break;

		case BrickletBarometer.DEVICE_IDENTIFIER:
			uidArray.BARO = uid;
			break;

		case BrickletBarometerV2.DEVICE_IDENTIFIER:
			uidArray.BAROV2 = uid;
			break;

		case BrickletHumidity.DEVICE_IDENTIFIER:
			uidArray.HUMI = uid;
			break;

		case BrickletHumidityV2.DEVICE_IDENTIFIER:
			uidArray.HUMIV2 = uid;
			break;

		case BrickletTemperature.DEVICE_IDENTIFIER:
			uidArray.TEMP = uid;
			break;

		case BrickletTemperatureV2.DEVICE_IDENTIFIER:
			uidArray.TEMPV2 = uid;
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
export async function getUids(host: string, port: number): Promise<string[]> {
	return new Promise(resolve => {
		connect(ipcon, host, port);
		ipcon.on(IPConnection.CALLBACK_CONNECTED, () => {
			ipcon.enumerate();
		});
		ipcon.on(IPConnection.CALLBACK_ENUMERATE, (uid: string, _connectedUid, _position, _hardwareVersion, _firmwareVersion, deviceIdentifier: string) => {
			defineBricklet(uid, deviceIdentifier);
		});
		setTimeout(() => {
			ipcon.disconnect();
			resolve(uidArray);
		}, 50);
	});
}
