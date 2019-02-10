const errorOutput = require('./error.js');

function connect(ipcon, HOST, PORT) {
	ipcon.connect(HOST, PORT,
		error => {
			console.error(errorOutput.error(error));
			process.exit();
		}
	);
}

module.exports = {
	connect
};
