const Tinkerforge = require('tinkerforge');
const output = require('./output.js');
const errorOutput = require('./error.js');
const getUids = require('./get-uid.js');
const ipconConnect = require('./ipcon-connect.js');

let uidArray = [];

let al;
let h;
let b;
let t;
let ipcon;
const outputData = [];
let alDivider = 100;
let hDivider = 100;
let WAIT;

function tfinit(HOST, PORT) {
	if (uidArray.LIGHT || uidArray.LIGHTV2 || uidArray.LIGHTV3 || uidArray.BARO || uidArray.BAROV2 || uidArray.HUMI || uidArray.HUMIV2 || uidArray.TEMP || uidArray.TEMPV2) {
		ipcon = new Tinkerforge.IPConnection();
		if (uidArray.LIGHTV3) {
			al = new Tinkerforge.BrickletAmbientLightV2(uidArray.LIGHTV3, ipcon);
		} else if (uidArray.LIGHTV2) {
			al = new Tinkerforge.BrickletAmbientLight(uidArray.LIGHTV2, ipcon);
		} else if (uidArray.LIGHT) {
			al = new Tinkerforge.BrickletAmbientLight(uidArray.LIGHT, ipcon);
			alDivider = 10;
		}

		if (uidArray.BAROV2) {
			b = new Tinkerforge.BrickletBarometer(uidArray.BAROV2, ipcon);
		} else if (uidArray.BARO) {
			b = new Tinkerforge.BrickletBarometer(uidArray.BARO, ipcon);
		}

		if (uidArray.HUMIV2) {
			h = new Tinkerforge.BrickletHumidityV2(uidArray.HUMIV2, ipcon);
		} else if (uidArray.HUMI) {
			h = new Tinkerforge.BrickletHumidity(uidArray.HUMI, ipcon);
			hDivider = 10;
		}

		if (uidArray.TEMPV2) {
			t = new Tinkerforge.BrickletTemperatureV2(uidArray.TEMPV2, ipcon);
		} else if (uidArray.TEMP) {
			t = new Tinkerforge.BrickletTemperature(uidArray.TEMP, ipcon);
		}

		ipconConnect.connect(ipcon, HOST, PORT);
	} else {
		console.error('ERROR: nothing connected');
		process.exit();
	}
}

function defineCallBack() {
	if (uidArray.LIGHTV3) {
		al.setIlluminanceCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.LIGHTV2 || uidArray.LIGHT) {
		al.setIlluminanceCallbackPeriod(WAIT);
	}

	if (uidArray.BAROV2) {
		b.setAirPressureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.BARO) {
		b.setAirPressureCallbackPeriod(WAIT);
	}

	if (uidArray.HUMIV2) {
		h.setHumidityCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.HUMI) {
		h.setHumidityCallbackPeriod(WAIT);
	}

	if (uidArray.TEMPV2) {
		t.setTemperatureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.TEMP) {
		t.setTemperatureCallbackPeriod(WAIT);
	}
}

function registerCallBack() {
	if (uidArray.LIGHTV3) {
		al.on(Tinkerforge.BrickletAmbientLightV3.CALLBACK_ILLUMINANCE,
			illuminance => {
				outputData[3] = (illuminance / alDivider) + ' Lux';
				output.output(outputData);
			}
		);
	} else if (uidArray.LIGHTV2) {
		al.on(Tinkerforge.BrickletAmbientLightV2.CALLBACK_ILLUMINANCE,
			illuminance => {
				outputData[3] = (illuminance / alDivider) + ' Lux';
				output.output(outputData);
			}
		);
	} else if (uidArray.LIGHT) {
		if (al) {
			al.on(Tinkerforge.BrickletAmbientLight.CALLBACK_ILLUMINANCE,
				illuminance => {
					outputData[3] = (illuminance / alDivider) + ' Lux';
					output.output(outputData);
				}
			);
		}
	}

	if (uidArray.BAROV2) {
		b.on(Tinkerforge.BrickletBarometerV2.CALLBACK_AIR_PRESSURE,
			airPressure => {
				outputData[1] = (airPressure / 1000) + ' mbar';
				output.output(outputData);
			}
		);
	} else if (uidArray.BARO) {
		b.on(Tinkerforge.BrickletBarometer.CALLBACK_AIR_PRESSURE,
			airPressure => {
				outputData[1] = (airPressure / 1000) + ' mbar';
				output.output(outputData);
			}
		);
	}

	if (uidArray.HUMIV2) {
		h.on(Tinkerforge.BrickletHumidityV2.CALLBACK_HUMIDITY,
			humidity => {
				outputData[0] = (humidity / hDivider) + ' %RH';
				output.output(outputData);
			}
		);
	} else if (uidArray.HUMI) {
		h.on(Tinkerforge.BrickletHumidity.CALLBACK_HUMIDITY,
			humidity => {
				outputData[0] = (humidity / hDivider) + ' %RH';
				output.output(outputData);
			}
		);
	}

	if (uidArray.TEMPV2) {
		t.on(Tinkerforge.BrickletTemperatureV2.CALLBACK_TEMPERATURE,
			temperature => {
				outputData[2] = (temperature / 100) + ' \u00B0C';
				output.output(outputData);
			}
		);
	} else if (uidArray.TEMP) {
		t.on(Tinkerforge.BrickletTemperature.CALLBACK_TEMPERATURE,
			temperature => {
				outputData[2] = (temperature / 100) + ' \u00B0C';
				output.output(outputData);
			}
		);
	}
}

function tfdataGet() {
	if (h) {
		h.getHumidity(
			humidity => {
				outputData[0] = (humidity / hDivider) + ' %RH';
			},
			error => {
				outputData[0] = errorOutput.error(error);
			}
		);
	}

	if (t) {
		t.getTemperature(
			temperature => {
				outputData[2] = (temperature / 100) + ' \u00B0C';
			},
			error => {
				outputData[2] = errorOutput.error(error);
			}
		);
	} else if (b) {
		b.getChipTemperature(
			temperature => {
				outputData[2] = (temperature / 100) + ' \u00B0C';
			},
			error => {
				outputData[2] = errorOutput.error(error);
			}
		);
	}

	if (b) {
		b.getAirPressure(
			airPressure => {
				outputData[1] = (airPressure / 1000) + ' mbar';
			},
			error => {
				outputData[1] = errorOutput.error(error);
			}
		);
	}

	if (al) {
		al.getIlluminance(
			illuminance => {
				outputData[3] = (illuminance / alDivider) + ' Lux';
			},
			error => {
				outputData[3] = errorOutput.error(error);
			}
		);
	}
}

function liveOutput() {
	simpleGet();
	setTimeout(() => {
		defineCallBack();
		registerCallBack();
	}, 25);
}

function simpleGet() {
	ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
		() => {
			tfdataGet();
		}
	);
}

function simpleOutput() {
	simpleGet();
	setTimeout(() => {
		output.output(outputData);
		ipcon.disconnect();
		process.exit(0);
	}, 10);
}

module.exports.tfget = async function (HOST = 'localhost', PORT = 4223, WaitPeriod = 1000, live = false) {
	WAIT = WaitPeriod;
	uidArray = await getUids.get(HOST, PORT);
	tfinit(HOST, PORT);
	if (live) {
		liveOutput();
	} else {
		simpleOutput();
	}
};
