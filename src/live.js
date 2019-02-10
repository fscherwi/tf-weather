const Tinkerforge = require('tinkerforge');
const logUpdate = require('log-update');
const time = require('./time.js');

let LIGHT;
let LIGHT_2;
let LIGHT_3;
let BARO;
let BARO_2;
let HUMI;
let HUMI_2;
let al;
let h;
let b;
let ipcon = new Tinkerforge.IPConnection();
const outputData = [];
let alDivider = 100;
let hDivider = 100;

let WAIT = 1000;

const errorOutput = require('./error.js');

function ipconConnect(HOST, PORT) {
	ipcon.connect(HOST, PORT,
		error => {
			console.error(errorOutput.error(error));
			process.exit();
		}
	);
}

function defineBricklets(uid, deviceIdentifier) {
	if (deviceIdentifier === Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER) {
		LIGHT = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletAmbientLightV2.DEVICE_IDENTIFIER) {
		LIGHT_2 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletAmbientLightV3.DEVICE_IDENTIFIER) {
		LIGHT_3 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER) {
		BARO = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletBarometerV2.DEVICE_IDENTIFIER) {
		BARO_2 = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER) {
		HUMI = uid;
	}

	if (deviceIdentifier === Tinkerforge.BrickletHumidityV2.DEVICE_IDENTIFIER) {
		HUMI_2 = uid;
	}
}

function getUids(HOST, PORT) {
	ipconConnect(HOST, PORT);
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
	// Ipcon.disconnect();
}

function tfinit(HOST, PORT) {
	if (LIGHT_2 || LIGHT || BARO || HUMI) {
		ipcon = new Tinkerforge.IPConnection();
		if (LIGHT_3) {
			al = new Tinkerforge.BrickletAmbientLightV2(LIGHT_3, ipcon);
		} else if (LIGHT_2) {
			al = new Tinkerforge.BrickletAmbientLight(LIGHT_2, ipcon);
		} else if (LIGHT) {
			al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
			alDivider = 10;
		}

		if (BARO_2) {
			b = new Tinkerforge.BrickletBarometer(BARO_2, ipcon);
		} else if (BARO) {
			b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
		}

		if (HUMI_2) {
			h = new Tinkerforge.BrickletHumidityV2(HUMI_2, ipcon);
		} else if (HUMI) {
			h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);
			hDivider = 10;
		}

		ipconConnect(HOST, PORT);
	} else {
		console.error('ERROR: nothing connected');
		process.exit();
	}
}

function defineCallBack() {
	if (LIGHT_3) {
		al.setIlluminanceCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (LIGHT_2 || LIGHT) {
		al.setIlluminanceCallbackPeriod(WAIT);
	}

	if (BARO_2) {
		b.setAirPressureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (BARO) {
		b.setAirPressureCallbackPeriod(WAIT);
	}

	if (HUMI_2) {
		h.setHumidityCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (HUMI) {
		h.setHumidityCallbackPeriod(WAIT);
	}
}

function registerCallBack() {
	if (LIGHT_3) {
		al.on(Tinkerforge.BrickletAmbientLightV3.CALLBACK_ILLUMINANCE,
			illuminance => {
				outputData[3] = (illuminance / alDivider) + ' Lux';
				output();
			}
		);
	} else if (LIGHT_2) {
		al.on(Tinkerforge.BrickletAmbientLightV2.CALLBACK_ILLUMINANCE,
			illuminance => {
				outputData[3] = (illuminance / alDivider) + ' Lux';
				output();
			}
		);
	} else if (LIGHT) {
		if (al) {
			al.on(Tinkerforge.BrickletAmbientLight.CALLBACK_ILLUMINANCE,
				illuminance => {
					outputData[3] = (illuminance / alDivider) + ' Lux';
					output();
				}
			);
		}
	}

	if (BARO_2) {
		b.on(Tinkerforge.BrickletBarometerV2.CALLBACK_AIR_PRESSURE,
			airPressure => {
				outputData[1] = (airPressure / 1000) + ' mbar';
				output();
			}
		);
	} else if (BARO) {
		b.on(Tinkerforge.BrickletBarometer.CALLBACK_AIR_PRESSURE,
			airPressure => {
				outputData[1] = (airPressure / 1000) + ' mbar';
				output();
			}
		);
	}

	if (HUMI_2) {
		h.on(Tinkerforge.BrickletHumidityV2.CALLBACK_HUMIDITY,
			humidity => {
				outputData[0] = (humidity / hDivider) + ' %RH';
				output();
			}
		);
	} else if (HUMI) {
		h.on(Tinkerforge.BrickletHumidity.CALLBACK_HUMIDITY,
			humidity => {
				outputData[0] = (humidity / hDivider) + ' %RH';
				output();
			}
		);
	}
}

function output() {
	logUpdate(
		`
Relative Humidity: ${outputData[0]}
Air pressure:      ${outputData[1]}
Illuminance:       ${outputData[3]}
Time:              ${time.get()}
`
	);
}

function liveOutput(HOST, PORT) {
	setTimeout(() => {
		tfinit(HOST, PORT);
	}, 150);
	setTimeout(() => {
		defineCallBack();
		registerCallBack();
	}, 250);
}

module.exports.tfget = function (HOST, PORT, WAITPeriod, live) {
	WAIT = WAITPeriod;
	getUids(HOST, PORT);
	if (live) {
		liveOutput(HOST, PORT);
	}
};
