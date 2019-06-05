const Tinkerforge = require('tinkerforge');
const ipconConnect = require('./ipcon-connect.js');

const ipcon = new Tinkerforge.IPConnection();

const uidArray = {
	LIGHT: '',
	LIGHTV2: '',
	LIGHTV3: '',
	BARO: '',
	BAROV2: '',
	HUMI: '',
	HUMIV2: '',
	TEMP: '',
	TEMPV2: ''
};

function defineBricklets(uid, deviceIdentifier) {
	if (deviceIdentifier === Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER) {
		uidArray.LIGHT = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletAmbientLightV2.DEVICE_IDENTIFIER) {
		uidArray.LIGHTV2 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletAmbientLightV3.DEVICE_IDENTIFIER) {
		uidArray.LIGHTV3 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER) {
		uidArray.BARO = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletBarometerV2.DEVICE_IDENTIFIER) {
		uidArray.BAROV2 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER) {
		uidArray.HUMI = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletHumidityV2.DEVICE_IDENTIFIER) {
		uidArray.HUMIV2 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletTemperature.DEVICE_IDENTIFIER) {
		uidArray.TEMP = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletTemperatureV2.DEVICE_IDENTIFIER) {
		uidArray.TEMPV2 = uid;
	}
}

module.exports.get = function (HOST, PORT) {
	return new Promise(resolve => {
		ipconConnect.connect(ipcon, HOST, PORT);
		ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
			() => {
				ipcon.enumerate();
			}
		);
		ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
			(uid, a, b, c, d, deviceIdentifier) => {
				defineBricklets(uid, deviceIdentifier);
			}
		);
		setTimeout(() => {
			ipcon.disconnect();
			resolve(uidArray);
		}, 25);
	});
};
