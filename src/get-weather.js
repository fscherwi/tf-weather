const Tinkerforge = require('tinkerforge');
const {output} = require('./output');
const getUids = require('./get-uid');
const ipconConnect = require('./ipcon-connect');

let ipcon;
let uidArray = [];
const bricklets = [];
const outputData = [];
let alDivider = 100;
let hDivider = 100;
let CALLBACK_ILLUMINANCE;
let CALLBACK_AIR_PRESSURE;
let CALLBACK_HUMIDITY;
let CALLBACK_TEMPERATURE;

/**
 * Init Tinkerforge connection
 *
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 */
function tfinit(host, port) {
	if (Object.keys(uidArray).length > 0) {
		ipcon = new Tinkerforge.IPConnection();
		if (uidArray.LIGHTV3) {
			bricklets.al = new Tinkerforge.BrickletAmbientLightV3(uidArray.LIGHTV3, ipcon);
			CALLBACK_ILLUMINANCE = Tinkerforge.BrickletAmbientLightV3.CALLBACK_ILLUMINANCE;
		} else if (uidArray.LIGHTV2) {
			bricklets.al = new Tinkerforge.BrickletAmbientLightV2(uidArray.LIGHTV2, ipcon);
			CALLBACK_ILLUMINANCE = Tinkerforge.BrickletAmbientLightV2.CALLBACK_ILLUMINANCE;
		} else if (uidArray.LIGHT) {
			bricklets.al = new Tinkerforge.BrickletAmbientLight(uidArray.LIGHT, ipcon);
			CALLBACK_ILLUMINANCE = Tinkerforge.BrickletAmbientLight.CALLBACK_ILLUMINANCE;
			alDivider = 10;
		}

		if (uidArray.BAROV2) {
			bricklets.b = new Tinkerforge.BrickletBarometer(uidArray.BAROV2, ipcon);
			CALLBACK_AIR_PRESSURE = Tinkerforge.BrickletBarometerV2.CALLBACK_AIR_PRESSURE;
		} else if (uidArray.BARO) {
			bricklets.b = new Tinkerforge.BrickletBarometer(uidArray.BARO, ipcon);
			CALLBACK_AIR_PRESSURE = Tinkerforge.BrickletBarometer.CALLBACK_AIR_PRESSURE;
		}

		if (uidArray.HUMIV2) {
			bricklets.h = new Tinkerforge.BrickletHumidityV2(uidArray.HUMIV2, ipcon);
			CALLBACK_HUMIDITY = Tinkerforge.BrickletHumidityV2.CALLBACK_HUMIDITY;
		} else if (uidArray.HUMI) {
			bricklets.h = new Tinkerforge.BrickletHumidity(uidArray.HUMI, ipcon);
			CALLBACK_HUMIDITY = Tinkerforge.BrickletHumidity.CALLBACK_HUMIDITY;
			hDivider = 10;
		}

		if (uidArray.TEMPV2) {
			bricklets.t = new Tinkerforge.BrickletTemperatureV2(uidArray.TEMPV2, ipcon);
			CALLBACK_TEMPERATURE = Tinkerforge.BrickletTemperatureV2.CALLBACK_TEMPERATURE;
		} else if (uidArray.TEMP) {
			bricklets.t = new Tinkerforge.BrickletTemperature(uidArray.TEMP, ipcon);
			CALLBACK_TEMPERATURE = Tinkerforge.BrickletTemperature.CALLBACK_TEMPERATURE;
		}

		ipconConnect.connect(ipcon, host, port);
	} else {
		console.error('\nERROR: nothing connected\n');
		process.exit();
	}
}

/**
 * Define Tinkerforge callbacks
 *
 * @param {number} WAIT callback wait period
 */
function defineCallBack(WAIT) {
	if (uidArray.LIGHTV3) {
		bricklets.al.setIlluminanceCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.LIGHTV2 || uidArray.LIGHT) {
		bricklets.al.setIlluminanceCallbackPeriod(WAIT);
	}

	if (uidArray.BAROV2) {
		bricklets.b.setAirPressureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.BARO) {
		bricklets.b.setAirPressureCallbackPeriod(WAIT);
	}

	if (uidArray.HUMIV2) {
		bricklets.h.setHumidityCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.HUMI) {
		bricklets.h.setHumidityCallbackPeriod(WAIT);
	}

	if (uidArray.TEMPV2) {
		bricklets.t.setTemperatureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (uidArray.TEMP) {
		bricklets.t.setTemperatureCallbackPeriod(WAIT);
	}
}

/**
 * Register Tinkerforge callbacks
 */
function registerCallBack() {
	if (bricklets.al) {
		bricklets.al.on(CALLBACK_ILLUMINANCE, illuminance => {
			outputData[3] = illuminance / alDivider;
			output(outputData);
		});
	}

	if (bricklets.b) {
		bricklets.b.on(CALLBACK_AIR_PRESSURE, airPressure => {
			outputData[1] = airPressure / 1000;
			output(outputData);
		});
	}

	if (bricklets.h) {
		bricklets.h.on(CALLBACK_HUMIDITY, humidity => {
			outputData[0] = humidity / hDivider;
			output(outputData);
		});
	}

	if (bricklets.t) {
		bricklets.t.on(CALLBACK_TEMPERATURE, temperature => {
			outputData[2] = temperature / 100;
			output(outputData);
		});
	}
}

/**
 * Get weather data
 */
function simpleGet() {
	ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED, () => {
		if (bricklets.h) {
			bricklets.h.getHumidity(humidity => {
				outputData[0] = humidity / hDivider;
			});
		}

		if (bricklets.b) {
			bricklets.b.getAirPressure(airPressure => {
				outputData[1] = airPressure / 1000;
			});
		}

		if (bricklets.t) {
			bricklets.t.getTemperature(temperature => {
				outputData[2] = temperature / 100;
			});
		} else if (bricklets.b && uidArray.BARO) {
			bricklets.b.getChipTemperature(temperature => {
				outputData[2] = temperature / 100;
			});
		}

		if (bricklets.al) {
			bricklets.al.getIlluminance(illuminance => {
				outputData[3] = illuminance / alDivider;
			});
		}
	});
}

/**
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 * @param {number} WAIT callback wait period
 * @param {boolean} live live output
 */
module.exports.tfget = async (host = 'localhost', port = 4223, WAIT = 1000, live = false) => {
	if (port >= 0 && port < 65536) {
		uidArray = await getUids.get(host, port);
		tfinit(host, port);
		simpleGet();
		if (live && WAIT >= 0 && WAIT <= 4294967295) {
			setTimeout(() => {
				defineCallBack(WAIT);
				registerCallBack();
			}, 25);
		} else if (live) {
			console.error('\nPlease check your inserted Callback time\n');
			process.exit(1);
		} else {
			setTimeout(() => {
				output(outputData);
				ipcon.disconnect();
			}, 10);
		}
	} else {
		console.error('\nPlease check your inserted PORT\n');
		process.exit(1);
	}
};
