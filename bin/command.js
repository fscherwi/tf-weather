#!/usr/bin/env node

const program = require('commander');

program
	.version(require('../package.json').version)
	.usage('[options]')
	.option('-l, --live', 'Shows the live weather')
	.option('-h, --host [host]', 'The HOST, default to "localhost"')
	.option('-p, --port [port]', 'The PORT, default to "4223"', parseInt)
	.option('-w, --wait [time]', 'The Callback time in milliseconds, default to "1000" ms', parseInt)
	.parse(process.argv);

require('../src/weather.js').tfget(program.host, program.port, program.wait, program.live);
