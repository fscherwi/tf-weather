#!/usr/bin/env node

const program = require('commander');

program
	.version(require('../package.json').version)
	.usage('[options]')
	.option('-l, --live', 'Shows the live weather')
	.option('-h, --host [host]', 'The HOST, default to "localhost"')
	.option('-p, --port [port]', 'The PORT, default to "4223"')
	.option('-w, --wait [time]', 'The Callback time in milliseconds, default to "1000" ms')
	.parse(process.argv);

if (!program.port || (program.port >= 0 && program.port < 65536)) {
	require('../src/get-weather.js').tfget(program.host, program.port, program.wait, program.live);
} else {
	console.error('\nPlease check your inserted PORT\n');
	process.exit(1);
}
