const errors: Array<[number, string]> = [
	[11, 'ALREADY CONNECTED'],
	[12, 'NOT CONNECTED'],
	[13, 'CONNECT FAILED'],
	[21, 'INVALID FUNCTION ID'],
	[31, 'TIMEOUT'],
	[41, 'INVALID PARAMETER'],
	[42, 'FUNCTION NOT SUPPORTED']
];

/**
 * Get the error text
 *
 * @param {number} code error code
 * @returns {string} error text
 */
function errorText(code: number): string {
	const error = errors.find(errors => errors[0] === code);
	return error ? error[1] : 'UNKNOWN';
}

/**
 * Connect to Tinkerforge
 *
 * @param ipcon Tinkerforge IP Connection
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 */
export function connect(ipcon, host: string, port: number) {
	ipcon.connect(host, port, (error: number) => {
		console.error(errorText(error));
		process.exit();
	});
}
