const errorText = require('./error-text.js').error;

module.exports.connect = function (ipcon, HOST, PORT) {
	ipcon.connect(HOST, PORT,
		error => {
			console.error(errorText(error));
			process.exit();
		}
	);
};
