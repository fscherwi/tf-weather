#!/usr/bin/env node

import { createCommand } from 'commander';
import { tfget } from '../src/get-weather';
import { version } from '../package.json';

const program = createCommand();

program
	.version(version)
	.option('-l, --live', 'Shows the live weather')
	.option('-h, --host [host]', 'The HOST, default to "localhost"')
	.option('-p, --port [port]', 'The PORT, default to "4223"')
	.option('-w, --wait [time]', 'The Callback time in milliseconds, default to "1000" ms')
	.parse(process.argv);

const options = program.opts();

if (options.port < 0 || options.port >= 65536) {
	console.error('\nPlease check your inserted PORT\n');
	process.exit(1);
}

if (options.wait < 0 || options.wait > 4294967295) {
	console.error('\nPlease check your inserted Callback time\n');
	process.exit(1);
}

(async () => {
	await tfget(options.host || 'localhost', options.port || 4223, options.wait || 1000, options.live || false);
})();
