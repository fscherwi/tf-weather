import { IPConnection, BrickletAmbientLightV3, BrickletAmbientLightV2, BrickletAmbientLight, BrickletBarometer, BrickletBarometerV2, BrickletHumidityV2, BrickletHumidity, BrickletTemperatureV2, BrickletTemperature } from 'tinkerforge';
import { output } from './output';
import { getUids } from './get-uid';
import { connect } from './ipcon-connect';
import { WeatherData } from '../types/weather-data';

let ipcon: any;
let uidArray: any = [];
const bricklets: any = [];
let weatherData: WeatherData;
let alDivider = 100;
let hDivider = 100;
let CALLBACK_ILLUMINANCE: number;
let CALLBACK_AIR_PRESSURE: number;
let CALLBACK_HUMIDITY: number;
let CALLBACK_TEMPERATURE: number;

/**
 * Init Tinkerforge connection
 *
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 */
function tfinit(host: string, port: number): void {
	if (Object.keys(uidArray).length > 0) {
		ipcon = new IPConnection();
		if (uidArray.LIGHTV3) {
			bricklets.al = new BrickletAmbientLightV3(uidArray.LIGHTV3, ipcon);
			CALLBACK_ILLUMINANCE = BrickletAmbientLightV3.CALLBACK_ILLUMINANCE;
		} else if (uidArray.LIGHTV2) {
			bricklets.al = new BrickletAmbientLightV2(uidArray.LIGHTV2, ipcon);
			CALLBACK_ILLUMINANCE = BrickletAmbientLightV2.CALLBACK_ILLUMINANCE;
		} else if (uidArray.LIGHT) {
			bricklets.al = new BrickletAmbientLight(uidArray.LIGHT, ipcon);
			CALLBACK_ILLUMINANCE = BrickletAmbientLight.CALLBACK_ILLUMINANCE;
			alDivider = 10;
		}

		if (uidArray.BAROV2) {
			bricklets.b = new BrickletBarometer(uidArray.BAROV2, ipcon);
			CALLBACK_AIR_PRESSURE = BrickletBarometerV2.CALLBACK_AIR_PRESSURE;
		} else if (uidArray.BARO) {
			bricklets.b = new BrickletBarometer(uidArray.BARO, ipcon);
			CALLBACK_AIR_PRESSURE = BrickletBarometer.CALLBACK_AIR_PRESSURE;
		}

		if (uidArray.HUMIV2) {
			bricklets.h = new BrickletHumidityV2(uidArray.HUMIV2, ipcon);
			CALLBACK_HUMIDITY = BrickletHumidityV2.CALLBACK_HUMIDITY;
		} else if (uidArray.HUMI) {
			bricklets.h = new BrickletHumidity(uidArray.HUMI, ipcon);
			CALLBACK_HUMIDITY = BrickletHumidity.CALLBACK_HUMIDITY;
			hDivider = 10;
		}

		if (uidArray.TEMPV2) {
			bricklets.t = new BrickletTemperatureV2(uidArray.TEMPV2, ipcon);
			CALLBACK_TEMPERATURE = BrickletTemperatureV2.CALLBACK_TEMPERATURE;
		} else if (uidArray.TEMP) {
			bricklets.t = new BrickletTemperature(uidArray.TEMP, ipcon);
			CALLBACK_TEMPERATURE = BrickletTemperature.CALLBACK_TEMPERATURE;
		}

		connect(ipcon, host, port);
	} else {
		console.error('\nERROR: nothing connected\n');
		process.exit(0);
	}
}

/**
 * Define Tinkerforge callbacks
 *
 * @param {number} WAIT callback wait period
 */
function defineCallBack(WAIT: number): void {
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
function registerCallBack(): void {
	if (bricklets.al) {
		bricklets.al.on(CALLBACK_ILLUMINANCE, (illuminance: number) => {
			weatherData = { ...weatherData, illuminance: illuminance / alDivider };
			output(weatherData);
		});
	}

	if (bricklets.b) {
		bricklets.b.on(CALLBACK_AIR_PRESSURE, (airPressure: number) => {
			weatherData = { ...weatherData, airPressure: airPressure / 1000 };
			output(weatherData);
		});
	}

	if (bricklets.h) {
		bricklets.h.on(CALLBACK_HUMIDITY, (humidity: number) => {
			weatherData = { ...weatherData, humidity: humidity / hDivider };
			output(weatherData);
		});
	}

	if (bricklets.t) {
		bricklets.t.on(CALLBACK_TEMPERATURE, (temperature: number) => {
			weatherData = { ...weatherData, temperature: temperature / 100 };
			output(weatherData);
		});
	}
}

/**
 * Get weather data
 */
function simpleGet(): void {
	ipcon.on(IPConnection.CALLBACK_CONNECTED, () => {
		if (bricklets.h) {
			bricklets.h.getHumidity((humidity: number) => {
				weatherData = { ...weatherData, humidity: humidity / hDivider };
			});
		}

		if (bricklets.b) {
			bricklets.b.getAirPressure((airPressure: number) => {
				weatherData = { ...weatherData, airPressure: airPressure / 1000 };
			});
		}

		if (bricklets.t) {
			bricklets.t.getTemperature((temperature: number) => {
				weatherData = { ...weatherData, temperature: temperature / 100 };
			});
		} else if (bricklets.b && uidArray.BARO) {
			bricklets.b.getChipTemperature((temperature: number) => {
				weatherData = { ...weatherData, temperature: temperature / 100 };
			});
		}

		if (bricklets.al) {
			bricklets.al.getIlluminance((illuminance: number) => {
				weatherData = { ...weatherData, illuminance: illuminance / alDivider };
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
export async function tfget(host = 'localhost', port = 4223, WAIT = 1000, live = false): Promise<void> {
	uidArray = await getUids(host, port);
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
			output(weatherData);
			ipcon.disconnect();
		}, 10);
	}
}
