/**
 * Connect to Tinkerforge
 *
 * @param {object} ipcon Tinkerforge IP Connection
 * @param {string} HOST Tinkerforge connection HOST
 * @param {number} PORT Tinkerforge connection PORT
 */
function connect(ipcon, HOST, PORT) {
	ipcon.connect(HOST, PORT, error => {
		console.error(errorText(error));
		process.exit();
	});
}

/**
 * Get the error text
 *
 * @param {number} code error code
 * @returns {string} error text
 */
function errorText(code) {
	switch (code) {
		case 11:
			return 'Error: ALREADY CONNECTED';
		case 12:
			return 'Error: NOT CONNECTED';
		case 13:
			return 'Error: CONNECT FAILED';
		case 21:
			return 'Error: INVALID FUNCTION ID';
		case 31:
			return 'Error: TIMEOUT';
		case 41:
			return 'Error: INVALID PARAMETER';
		case 42:
			return 'Error: FUNCTION NOT SUPPORTED';
		default:
			return 'UNKNOWN Error';
	}
}

module.exports.connect = connect;
