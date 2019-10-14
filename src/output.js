const logUpdate = require('log-update');

/**
 * Get the current time
 *
 * @returns {string} current time
 */
function time() {
	const date = new Date();
	return ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()) + ':' + ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
}

/**
 * Output the weather data
 *
 * @param {string[]} outputData Weather data array
 */
module.exports.output = outputData => {
	logUpdate(`
${(outputData[0] ? ('Relative Humidity: ' + outputData[0] + ' %RH\n') : '')}${(outputData[1] ? ('Air pressure:      ' + outputData[1] + ' mbar\n') : '')}${(outputData[2] ? ('Temperature:       ' + outputData[2] + ' \u00B0C\n') : '')}${(outputData[3] ? ('Illuminance:       ' + outputData[3] + ' Lux\n') : '')}
Time:              ${time()}
`);
};
