#!/usr/bin/env node

var program = require('commander');
/* istanbul ignore next */
program
  .version(require('./package.json').version)
  .usage('[options]')
  .option('-l, --live', 'Shows the live weather')
  .option('-h, --host [host]', 'The HOST, default to "localhost"')
  .option('-p, --port [port]', 'The PORT, default to "4223"', parseInt)
  .option('-w, --wait [time]', 'The Callback time', parseInt)
  .parse(process.argv);
/* istanbul ignore next */
if (!program.args.length) {
  var w = require('./weather.js');
  var HOST;
  var PORT;
  var WAIT;
  if (program.host) {
    HOST = program.host;
  } else {
    HOST = 'localhost';
  }
  if (program.port) {
    PORT = program.port;
  } else {
    PORT = 4223;
  }
  if (program.wait) {
    WAIT = program.wait;
  } else {
    WAIT = 1000;
  }

  if (program.live) {
    w.get(HOST, PORT, WAIT, live = true);
  } else {
    w.get(HOST, PORT, live = false);
  }
} else {
  program.help();
}
