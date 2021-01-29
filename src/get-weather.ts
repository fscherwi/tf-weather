import { IPConnection, BrickletAmbientLightV3, BrickletAmbientLightV2, BrickletAmbientLight, BrickletBarometer, BrickletBarometerV2, BrickletHumidityV2, BrickletHumidity, BrickletTemperatureV2, BrickletTemperature } from 'tinkerforge';
import { output } from './output';
import { getUids } from './get-uid';
import { connect } from './ipcon-connect';
import { WeatherData } from '../types/weather-data';
import { Callbacks } from '../types/callbacks';
import { BrickletData } from '../types/bricklet-data';
import { Bricklets } from '../types/bricklets';

/**
 * Init Tinkerforge connection
 *
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 * @param {BrickletData} brickletData UID array with versions
 * @param {Bricklets} bricklets the bricklet objects
 * @param {Callbacks} callbacks Tinkforge Callbacks
 * @returns {any} Tinkerforge IP Connection
 */
function tfinit(host: string, port: number, brickletData: BrickletData, bricklets: Bricklets, callbacks: Callbacks): any {
	const ipcon = new IPConnection();
	if (brickletData.LIGHT.VERSION === 3) {
		bricklets.al = new BrickletAmbientLightV3(brickletData.LIGHT.UID, ipcon);
		callbacks.CALLBACK_ILLUMINANCE = BrickletAmbientLightV3.CALLBACK_ILLUMINANCE;
	} else if (brickletData.LIGHT.VERSION === 2) {
		bricklets.al = new BrickletAmbientLightV2(brickletData.LIGHT.UID, ipcon);
		callbacks.CALLBACK_ILLUMINANCE = BrickletAmbientLightV2.CALLBACK_ILLUMINANCE;
	} else if (brickletData.LIGHT.VERSION === 1) {
		bricklets.al = new BrickletAmbientLight(brickletData.LIGHT.UID, ipcon);
		callbacks.CALLBACK_ILLUMINANCE = BrickletAmbientLight.CALLBACK_ILLUMINANCE;
	}

	if (brickletData.BARO.VERSION === 2) {
		bricklets.b = new BrickletBarometer(brickletData.BARO.UID, ipcon);
		callbacks.CALLBACK_AIR_PRESSURE = BrickletBarometerV2.CALLBACK_AIR_PRESSURE;
	} else if (brickletData.BARO.VERSION === 1) {
		bricklets.b = new BrickletBarometer(brickletData.BARO.UID, ipcon);
		callbacks.CALLBACK_AIR_PRESSURE = BrickletBarometer.CALLBACK_AIR_PRESSURE;
	}

	if (brickletData.HUMI.VERSION === 2) {
		bricklets.h = new BrickletHumidityV2(brickletData.HUMI.UID, ipcon);
		callbacks.CALLBACK_HUMIDITY = BrickletHumidityV2.CALLBACK_HUMIDITY;
	} else if (brickletData.HUMI.VERSION === 1) {
		bricklets.h = new BrickletHumidity(brickletData.HUMI.UID, ipcon);
		callbacks.CALLBACK_HUMIDITY = BrickletHumidity.CALLBACK_HUMIDITY;
	}

	if (brickletData.TEMP.VERSION === 2) {
		bricklets.t = new BrickletTemperatureV2(brickletData.TEMP.UID, ipcon);
		callbacks.CALLBACK_TEMPERATURE = BrickletTemperatureV2.CALLBACK_TEMPERATURE;
	} else if (brickletData.TEMP.VERSION === 1) {
		bricklets.t = new BrickletTemperature(brickletData.TEMP.UID, ipcon);
		callbacks.CALLBACK_TEMPERATURE = BrickletTemperature.CALLBACK_TEMPERATURE;
	}

	connect(ipcon, host, port);

	return ipcon;
}

/**
 * Define Tinkerforge callbacks
 *
 * @param {BrickletData} brickletData UID array with versions
 * @param {Bricklets} bricklets the bricklet objects
 * @param {number} WAIT callback wait period
 */
function defineCallBack(brickletData: BrickletData, bricklets: Bricklets, WAIT: number): void {
	if (brickletData.LIGHT.VERSION === 3) {
		bricklets.al.setIlluminanceCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (brickletData.LIGHT.VERSION === (1 || 2)) {
		bricklets.al.setIlluminanceCallbackPeriod(WAIT);
	}

	if (brickletData.BARO.VERSION === 2) {
		bricklets.b.setAirPressureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (brickletData.BARO.VERSION === 1) {
		bricklets.b.setAirPressureCallbackPeriod(WAIT);
	}

	if (brickletData.HUMI.VERSION === 2) {
		bricklets.h.setHumidityCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (brickletData.HUMI.VERSION === 1) {
		bricklets.h.setHumidityCallbackPeriod(WAIT);
	}

	if (brickletData.TEMP.VERSION === 2) {
		bricklets.t.setTemperatureCallbackConfiguration(WAIT, false, 'x', 0, 0);
	} else if (brickletData.TEMP.VERSION === 1) {
		bricklets.t.setTemperatureCallbackPeriod(WAIT);
	}
}

/**
 * Register Tinkerforge callbacks
 *
 * @param {Bricklets} bricklets the bricklet objects
 * @param {Callbacks} callbacks Tinkforge Callbacks
 * @param {WeatherData} weatherData weather data
 * @param {number} alDivider the divider for the Ambient Light value
 * @param {number} hDivider the divider for the Humidity value
 */
function registerCallBack(bricklets: Bricklets, callbacks: Callbacks, weatherData: WeatherData, alDivider: number, hDivider: number): void {
	bricklets.al?.on(callbacks.CALLBACK_ILLUMINANCE, (illuminance: number) => {
		weatherData = { ...weatherData, illuminance: illuminance / alDivider };
		output(weatherData);
	});

	bricklets.b?.on(callbacks.CALLBACK_AIR_PRESSURE, (airPressure: number) => {
		weatherData = { ...weatherData, airPressure: airPressure / 1000 };
		output(weatherData);
	});

	bricklets.h?.on(callbacks.CALLBACK_HUMIDITY, (humidity: number) => {
		weatherData = { ...weatherData, humidity: humidity / hDivider };
		output(weatherData);
	});

	bricklets.t?.on(callbacks.CALLBACK_TEMPERATURE, (temperature: number) => {
		weatherData = { ...weatherData, temperature: temperature / 100 };
		output(weatherData);
	});
}

/**
 * Get weather data
 *
 * @param {any} ipcon Tinkerforge IP Connection
 * @param {Bricklets} bricklets the bricklet objects
 * @param {WeatherData} weatherData weather data
 * @param {number} alDivider the divider for the Ambient Light value
 * @param {number} hDivider the divider for the Humidity value
 */
function simpleGet(ipcon: any, bricklets: Bricklets, weatherData: WeatherData, alDivider: number, hDivider: number): void {
	ipcon.on(IPConnection.CALLBACK_CONNECTED, () => {
		bricklets.h?.getHumidity((humidity: number) => {
			weatherData.humidity = humidity / hDivider;
		});

		bricklets.b?.getAirPressure((airPressure: number) => {
			weatherData.airPressure = airPressure / 1000;
		});

		if (bricklets.t) {
			bricklets.t.getTemperature((temperature: number) => {
				weatherData.temperature = temperature / 100;
			});
		} else if (bricklets.b) {
			bricklets.b.getChipTemperature((temperature: number) => {
				weatherData.temperature = temperature / 100;
			});
		}

		bricklets.al?.getIlluminance((illuminance: number) => {
			weatherData.illuminance = illuminance / alDivider;
		});
	});
}

/**
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 * @param {number} WAIT callback wait period
 * @param {boolean} live live output
 */
export async function tfget(host: string, port: number, WAIT: number, live: boolean): Promise<void> {
	const brickletData = await getUids(host, port);
	if (Object.keys(brickletData).length === 0) {
		console.error('\nERROR: nothing connected\n');
		process.exit(0);
	}

	const callbacks: Callbacks = {};
	const weatherData: WeatherData = {};
	const bricklets: Bricklets = {};

	const ipcon = tfinit(host, port, brickletData, bricklets, callbacks);
	const alDivider = brickletData.LIGHT?.VERSION === 1 ? 10 : 100;
	const hDivider = brickletData.HUMI?.VERSION === 1 ? 10 : 100;
	simpleGet(ipcon, bricklets, weatherData, alDivider, hDivider);
	if (live) {
		setTimeout(() => {
			defineCallBack(brickletData, bricklets, WAIT);
			registerCallBack(bricklets, callbacks, weatherData, alDivider, hDivider);
		}, 25);
		process.on('SIGINT', () => {
			ipcon.disconnect();
			process.exit(0);
		});
	} else {
		setTimeout(() => {
			output(weatherData);
			ipcon.disconnect();
		}, 10);
	}
}
