const Tinkerforge = require('tinkerforge');

let LIGHT;
let LIGHT_2;
let BARO;
let HUMI;
let al;
let h;
let b;
let ipcon;
const outputData = [];

function ipconConnect(HOST, PORT) {
	ipcon.connect(HOST, PORT,
		error => {
			console.log(errorOutput(error));
			process.exit();
		}
	);
}

function getUid(HOST, PORT) {
	ipcon = new Tinkerforge.IPConnection();
	ipconConnect(HOST, PORT);
	ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
		() => {
			ipcon.enumerate();
		}
	);
	ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
		(uid, a, b, c, d, deviceIdentifier) => {
			if (deviceIdentifier === Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER) {
				LIGHT = uid;
			}

			if (deviceIdentifier === Tinkerforge.BrickletAmbientLightV2.DEVICE_IDENTIFIER) {
				LIGHT_2 = uid;
			}

			if (deviceIdentifier === Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER) {
				BARO = uid;
			}

			if (deviceIdentifier === Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER) {
				HUMI = uid;
			}
		}
	);
}

function tfinit(HOST, PORT) {
	if (LIGHT_2 || LIGHT || BARO || HUMI) {
		ipcon = new Tinkerforge.IPConnection();
		if (LIGHT_2) {
			al = new Tinkerforge.BrickletAmbientLightV2(LIGHT, ipcon);
		} else if (LIGHT) {
			al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
		}

		if (BARO) {
			b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
		}

		if (HUMI) {
			h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);
		}

		ipconConnect(HOST, PORT);
	} else {
		console.log('ERROR: nothing connected');
		process.exit();
	}
}

function tfdataGet() {
	if (h) {
		h.getHumidity(
			humidity => {
				outputData[0] = (humidity / 10) + ' %RH';
			},
			error => {
				outputData[0] = errorOutput(error);
			}
		);
	}

	if (b) {
		b.getAirPressure(
			airPressure => {
				outputData[1] = (airPressure / 1000) + ' mbar';
			},
			error => {
				outputData[1] = errorOutput(error);
			}
		);
		b.getChipTemperature(
			temperature => {
				outputData[2] = (temperature / 100) + ' \u00B0C';
			},
			error => {
				outputData[2] = errorOutput(error);
			}
		);
	}

	if (al) {
		al.getIlluminance(
			illuminance => {
				outputData[3] = (illuminance / 10) + ' Lux';
			},
			error => {
				outputData[3] = errorOutput(error);
			}
		);
	}
}

function getTime(date) {
	return ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()) + ':' + ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
}

function errorOutput(code) {
	switch (code) {
		case 11:
			return 'Error: ALREADY CONNECTED';
		case 12:
			return 'Error: NOT CONNECTED';
		case 13:
			return 'Error: CONNECT FAILED';
		case 21:
			return 'Error: INVALID FUNCTION ID';
		case 31:
			return 'Error: TIMEOUT';
		case 41:
			return 'Error: INVALID PARAMETER';
		case 42:
			return 'Error: FUNCTION NOT SUPPORTED';
		default:
			return 'Error: UNKNOWN ERROR';
	}
}

function output() {
	console.log('\nRelative Humidity:\t' + outputData[0] + '\n' +
    'Air pressure:\t\t' + outputData[1] + '\n' +
    'Temperature:\t\t' + outputData[2] + '\n' +
    'Illuminance:\t\t' + outputData[3] + '\n' +
    '\nTime:\t\t\t' + getTime(new Date()) + '\n');
}

function simpleOutput(HOST, PORT) {
	setTimeout(() => {
		tfinit(HOST, PORT);
		ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
			() => {
				tfdataGet();
			}
		);
		setTimeout(() => {
			output();
			ipcon.disconnect();
			process.exit(0);
		}, 10);
	}, 25);
}

function liveOutput(HOST, PORT, WAIT) {
	setTimeout(() => {
		ipcon.disconnect();
		tfinit(HOST, PORT);
	}, 150);
	setTimeout(() => {
		process.stdin.on('data',
			() => {
				ipcon.disconnect();
				process.exit();
			}
		);
		tfdataGet();
		setInterval(() => {
			tfdataGet();
			// Console.log('\033[2J');
			output();
		}, WAIT);
	}, 25);
}

module.exports.name = function (HOST, PORT, WAIT, live) {
	getUid(HOST, PORT);
	if (live) {
		liveOutput(HOST, PORT, WAIT);
	} else {
		simpleOutput(HOST, PORT);
	}
};
