const logUpdate = require('log-update');
const time = require('./time.js');

module.exports.output = function (outputData) {
	logUpdate(
		`
Relative Humidity: ${outputData[0]}
Air pressure:      ${outputData[1]}
Temperature:       ${outputData[2]}
Illuminance:       ${outputData[3]}
Time:              ${time.get()}
`
	);
}
