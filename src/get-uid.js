const Tinkerforge = require('tinkerforge');
const ipconConnect = require('./ipcon-connect.js');

const ipcon = new Tinkerforge.IPConnection();
const uidArray = [];

/**
 * Find and define Bricklet
 *
 * @param {string} uid Bricklet uid
 * @param {string} deviceIdentifier Bricklet deviceIdentifier
 */
function defineBricklet(uid, deviceIdentifier) {
	switch (deviceIdentifier) {
		case Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER:
			uidArray.LIGHT = uid;
			break;

		case Tinkerforge.BrickletAmbientLightV2.DEVICE_IDENTIFIER:
			uidArray.LIGHTV2 = uid;
			break;

		case Tinkerforge.BrickletAmbientLightV3.DEVICE_IDENTIFIER:
			uidArray.LIGHTV3 = uid;
			break;

		case Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER:
			uidArray.BARO = uid;
			break;

		case Tinkerforge.BrickletBarometerV2.DEVICE_IDENTIFIER:
			uidArray.BAROV2 = uid;
			break;

		case Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER:
			uidArray.HUMI = uid;
			break;

		case Tinkerforge.BrickletHumidityV2.DEVICE_IDENTIFIER:
			uidArray.HUMIV2 = uid;
			break;

		case Tinkerforge.BrickletTemperature.DEVICE_IDENTIFIER:
			uidArray.TEMP = uid;
			break;

		case Tinkerforge.BrickletTemperatureV2.DEVICE_IDENTIFIER:
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
 * @returns {object} ctPromise
 */
module.exports.get = (host, port) => {
	return new Promise(resolve => {
		ipconConnect.connect(ipcon, host, port);
		ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED, () => {
			ipcon.enumerate();
		});
		ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE, (uid, _connectedUid, _position, _hardwareVersion, _firmwareVersion, deviceIdentifier) => {
			defineBricklet(uid, deviceIdentifier);
		});
		setTimeout(() => {
			ipcon.disconnect();
			resolve(uidArray);
		}, 50);
	});
};
