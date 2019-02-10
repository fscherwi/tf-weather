const errorOutput = require('./error.js');

module.exports.connect = function (ipcon, HOST, PORT) {
	ipcon.connect(HOST, PORT,
		error => {
			console.error(errorOutput.error(error));
			process.exit();
		}
	);
};
