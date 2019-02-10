const Tinkerforge = require('tinkerforge');
const output = require('./output.js');
const errorOutput = require('./error.js');
const getUids = require('./get-uid.js');

let uidArray = [];

let al;
let h;
let b;
let t;
let ipcon = new Tinkerforge.IPConnection();
const outputData = [];
let alDivider = 100;
let hDivider = 100;

let WAIT = 1000;

function ipconConnect(HOST, PORT) {
	ipcon.connect(HOST, PORT,
		error => {
			console.error(errorOutput.error(error));
			process.exit();
		}
	);
}

function tfinit(HOST, PORT) {
	if (uidArray.LIGHT || uidArray.LIGHT_2 || uidArray.LIGHT_3 || uidArray.BARO || uidArray.BARO_2 || uidArray.HUMI || uidArray.HUMI_2 || uidArray.TEMP || uidArray.TEMP_2) {
		ipcon = new Tinkerforge.IPConnection();
		if (uidArray.LIGHT_3) {
			al = new Tinkerforge.BrickletAmbientLightV2(uidArray.LIGHT_3, ipcon);
		} else if (uidArray.LIGHT_2) {
			al = new Tinkerforge.BrickletAmbientLight(uidArray.LIGHT_2, ipcon);
		} else if (uidArray.LIGHT) {
			al = new Tinkerforge.BrickletAmbientLight(uidArray.LIGHT, ipcon);
			alDivider = 10;
		}

		if (uidArray.BARO_2) {
			b = new Tinkerforge.BrickletBarometer(uidArray.BARO_2, ipcon);
		} else if (uidArray.BARO) {
			b = new Tinkerforge.BrickletBarometer(uidArray.BARO, ipcon);
		}

		if (uidArray.HUMI_2) {
			h = new Tinkerforge.BrickletHumidityV2(uidArray.HUMI_2, ipcon);
		} else if (uidArray.HUMI) {
			h = new Tinkerforge.BrickletHumidity(uidArray.HUMI, ipcon);
			hDivider = 10;
		}

		if (uidArray.TEMP_2) {
			t = new Tinkerforge.BrickletTemperatureV2(uidArray.TEMP_2, ipcon);
		} else if (uidArray.TEMP) {
			t = new Tinkerforge.BrickletTemperature(uidArray.TEMP, ipcon);
		}

		ipconConnect(HOST, PORT);
	} else {
		console.error('ERROR: nothing connected');
		process.exit();
	}
}

function defineCallBack() {
	if (uidArray.LIGHT_3) {
		al.setIlluminanceCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.LIGHT_2 || uidArray.LIGHT) {
		al.setIlluminanceCallbackPeriod(WAIT);
	}

	if (uidArray.BARO_2) {
		b.setAirPressureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.BARO) {
		b.setAirPressureCallbackPeriod(WAIT);
	}

	if (uidArray.HUMI_2) {
		h.setHumidityCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.HUMI) {
		h.setHumidityCallbackPeriod(WAIT);
	}

	if (uidArray.TEMP_2) {
		t.setTemperatureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.TEMP) {
		t.setTemperatureCallbackPeriod(WAIT);
	}
}

function registerCallBack() {
	if (uidArray.LIGHT_3) {
		al.on(Tinkerforge.BrickletAmbientLightV3.CALLBACK_ILLUMINANCE,
			illuminance => {
				outputData[3] = (illuminance / alDivider) + ' Lux';
				output.output(outputData);
			}
		);
	} else if (uidArray.LIGHT_2) {
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

	if (uidArray.BARO_2) {
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

	if (uidArray.HUMI_2) {
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

	if (uidArray.TEMP_2) {
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

function liveOutput(HOST, PORT) {
	setTimeout(() => {
		tfinit(HOST, PORT);
	}, 150);
	setTimeout(() => {
		defineCallBack();
		registerCallBack();
	}, 200);
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
			output.output(outputData);
			ipcon.disconnect();
			process.exit(0);
		}, 10);
	}, 25);
}

module.exports.tfget = async function (HOST, PORT, WAITPeriod, live) {
	WAIT = WAITPeriod;
	uidArray = await getUids.get(HOST, PORT);
	// SetTimeout(() => {
	if (live) {
		liveOutput(HOST, PORT);
	} else {
		simpleOutput(HOST, PORT);
	}
	// }, 5000);
};
