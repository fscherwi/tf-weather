import IPConnection from 'tinkerforge';

const errors: Array<{ code: number; message: string }> = [
	{ code: IPConnection.ERROR_ALREADY_CONNECTED, message: 'ALREADY CONNECTED' },
	{ code: IPConnection.ERROR_NOT_CONNECTED, message: 'NOT CONNECTED' },
	{ code: IPConnection.ERROR_CONNECT_FAILED, message: 'CONNECT FAILED' },
	{ code: IPConnection.ERROR_INVALID_FUNCTION_ID, message: 'INVALID FUNCTION ID' },
	{ code: IPConnection.ERROR_TIMEOUT, message: 'TIMEOUT' },
	{ code: IPConnection.ERROR_INVALID_PARAMETER, message: 'INVALID PARAMETER' },
	{ code: IPConnection.ERROR_FUNCTION_NOT_SUPPORTED, message: 'FUNCTION NOT SUPPORTED' }
];

/**
 * Get the error text
 *
 * @param {number} code error code
 * @returns {string} error text
 */
function errorText(code: number): string {
	const error = errors.find(errors => errors.code === code);
	return error ? error.message : 'UNKNOWN';
}

/**
 * Connect to Tinkerforge
 *
 * @param {any} ipcon Tinkerforge IP Connection
 * @param {string} host Tinkerforge connection HOST
 * @param {number} port Tinkerforge connection PORT
 */
export function connect(ipcon: any, host: string, port: number): void {
	ipcon.connect(host, port, (error: number) => {
		console.error('Error: ' + errorText(error));
		process.exit();
	});
}
