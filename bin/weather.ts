#!/usr/bin/env node

import { createCommand } from 'commander';
import { tfget } from '../src/get-weather';
import { version } from '../package.json';
const inRange = require('in-range');

const program = createCommand();

program
	.version(version)
	.option('-l, --live', 'Shows the live weather')
	.option('-h, --host [host]', 'The HOST, default to "localhost"')
	.option('-p, --port [port]', 'The PORT, default to "4223"', parseInt)
	.option('-w, --wait [time]', 'The Callback time in milliseconds, default to "1000" ms', parseInt)
	.parse(process.argv);

const options = program.opts();

if (typeof options.host !== ('string' && 'undefined')) {
	console.error('Error: check your inserted HOST');
	process.exit(1);
}

if ((options.port != undefined && !Number.isInteger(options.port)) || (options.port != undefined && Number.isInteger(options.port) && !inRange(options.port, { start: 0, end: 65536 }))) {
	console.error('Error: check your inserted PORT');
	process.exit(1);
}

if ((options.wait != undefined && !Number.isInteger(options.wait)) || (options.wait != undefined && Number.isInteger(options.wait) && !inRange(options.wait, { start: 0, end: 4294967295 }))) {
	console.error('Error: check your inserted Callback time');
	process.exit(1);
}

(async () => {
	await tfget(options.host || 'localhost', options.port || 4223, options.wait || 1000, options.live || false);
})();
