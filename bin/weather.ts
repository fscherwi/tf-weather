#!/usr/bin/env node

import yargs from 'yargs';
import { tfget } from '../src/get-weather';

const { argv } = yargs.options({
	live: { type: 'boolean', default: false, description: 'Shows the live weather' },
	host: { type: 'string', default: 'localhost', description: 'The HOST' },
	port: { type: 'number', default: 4223, description: 'The PORT' },
	wait: { type: 'number', default: 1000, description: 'The Callback time in ms' }
});

if (argv.port > 65536) {
	console.error('Error: check your inserted PORT');
	process.exit(1);
}

if (argv.wait > 4294967295) {
	console.error('Error: check your inserted Callback time');
	process.exit(1);
}

(async () => {
	await tfget(argv.host, argv.port, argv.wait, argv.live);
})();
