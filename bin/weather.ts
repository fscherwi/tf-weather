#!/usr/bin/env node

import process from 'node:process';
import yargs from 'yargs';
import { tfget } from '../src/get-weather';

const { argv } = yargs.options({
	live: { type: 'boolean', default: false, description: 'Shows the live weather' },
	host: { type: 'string', default: 'localhost', description: 'The HOST' },
	port: { type: 'number', default: 4223, description: 'The PORT' },
	wait: { type: 'number', default: 1000, description: 'The Callback time in ms' }
});

(async () => {
	const { host, port, wait, live } = await argv;

	if (port < 0 || port >= 65_536) {
		console.error('\nError: PORT should be >= 0 and < 65536\n');
		process.exit(1);
	}

	if (wait < 0 || wait > 4_294_967_295) {
		console.error('\nError: check your inserted Callback time\n');
		process.exit(1);
	}

	await tfget(host, port, wait, live);
})();
