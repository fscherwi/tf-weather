#!/usr/bin/env node

import program from 'commander';
import {tfget} from '../src/get-weather';
import {version} from '../package.json';

program
	.version(version)
	.usage('[options]')
	.option('-l, --live', 'Shows the live weather')
	.option('-h, --host [host]', 'The HOST, default to "localhost"')
	.option('-p, --port [port]', 'The PORT, default to "4223"')
	.option('-w, --wait [time]', 'The Callback time in milliseconds, default to "1000" ms')
	.parse(process.argv);

const options = program.opts();

if (!options.port || (options.port >= 0 && options.port < 65536)) {
	(async () => {
		await tfget(options.host, options.port, options.wait, options.live);
	})();
} else {
	console.error('\nPlease check your inserted PORT\n');
	process.exit(1);
}
