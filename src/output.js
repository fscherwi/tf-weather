const logUpdate = require('log-update');
const time = require('./time.js');

module.exports.output = function (outputData) {
	let outputString = '\n';
	if (outputData[0]) {
		outputString = outputString + 'Relative Humidity: ' + outputData[0] + '\n';
	}

	if (outputData[1]) {
		outputString = outputString + 'Air pressure:      ' + outputData[1] + '\n';
	}

	if (outputData[2]) {
		outputString = outputString + 'Temperature:       ' + outputData[2] + '\n';
	}

	if (outputData[3]) {
		outputString = outputString + 'Illuminance:       ' + outputData[3] + '\n';
	}

	outputString = outputString + 'Time:              ' + time.get() + '\n';
	logUpdate(outputString);
};
