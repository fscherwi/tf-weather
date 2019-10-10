const logUpdate = require('log-update');

module.exports.output = function (outputData) {
	logUpdate(`
${(outputData[0] ? ('Relative Humidity: ' + outputData[0]) : '')} %RH
${(outputData[1] ? ('Air pressure:      ' + outputData[1]) : '')} mbar
${(outputData[2] ? ('Temperature:       ' + outputData[2]) : '')} \u00B0C
${(outputData[3] ? ('Illuminance:       ' + outputData[3]) : '')} Lux
Time:              ${time()}
`);
};

function time() {
	const date = new Date();
	return ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()) + ':' + ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
}
