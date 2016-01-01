#!/usr/bin/env node
var program = require('commander');
program
  .version(require('../package.json').version)
  .usage('[options]')
  .option('-l, --live', 'Shows the live weather')
  .option('-h, --host [host]', 'The HOST, default to "localhost"')
  .option('-p, --port [port]', 'The PORT, default to "4223"', parseInt)
  .option('-w, --wait [time]', 'The Callback time in milliseconds, default to "1000" ms', parseInt)
  .parse(process.argv);
/* istanbul ignore next */
if (!program.args.length) {
  if (!program.host) {
    program.host = 'localhost';
  }
  if (!program.port) {
    program.port = 4223;
  }
  if (program.live) {
    if (!program.wait) {
      program.wait = 1000;
    }
    require('./weather.js').get(program.host, program.port, program.wait, live = true);
  } else {
    require('./weather.js').get(program.host, program.port, live = false);
  }
} else {
  program.help();
}
