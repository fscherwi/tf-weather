import logUpdate from 'log-update';
import { WeatherData } from '../interfaces/weather-data';

/**
 * Get the current time
 *
 * @returns {string} current time
 */
function time(): string {
	const date = new Date();
	return (date.getHours() < 10 ? '0' : '') + date.getHours().toString() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString();
}

/**
 * Output the weather data
 *
 * @param {WeatherData} weatherData Weather data
 */
export function output(weatherData: WeatherData): void {
	logUpdate(`
${(weatherData.humidity ? ('Relative Humidity:\t' + weatherData.humidity.toString() + '\t%RH\n') : '')}${(weatherData.airPressure ? ('Air pressure:\t\t' + weatherData.airPressure.toString() + '\tmbar\n') : '')}${(weatherData.temperature ? ('Temperature:\t\t' + weatherData.temperature.toString() + '\t\u00B0C\n') : '')}${(weatherData.illuminance ? ('Illuminance:\t\t' + weatherData.illuminance.toString() + '\tLux\n') : '')}
Time:\t\t\t${time()}
`);
}
