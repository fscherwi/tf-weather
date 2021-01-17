import logUpdate from 'log-update';

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
 * @param {string[]} outputData Weather data array
 */
export function output(outputData: string[]): void {
	logUpdate(`
${(outputData[0] ? ('Relative Humidity:\t' + outputData[0] + ' %RH\n') : '')}${(outputData[1] ? ('Air pressure:\t\t' + outputData[1] + ' mbar\n') : '')}${(outputData[2] ? ('Temperature:\t\t' + outputData[2] + ' \u00B0C\n') : '')}${(outputData[3] ? ('Illuminance:\t\t' + outputData[3] + ' Lux\n') : '')}
Time:\t\t\t${time()}
`);
}
