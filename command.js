#!/usr/bin/env node

/* istanbul ignore next */
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
    HOST = "localhost";
  }
  /* istanbul ignore next */
  if (program.port) {
    PORT = program.port;
  } else {
    PORT = 4223;
  }
  /* istanbul ignore next */
  if (program.wait) {
    WAIT = program.wait;
  } else {
    WAIT = 1000;
  }

  if (program.live) {
    w.tflive();
  } else {
    w.tfsimple(HOST, PORT, WAIT);
  }
} else {
  program.help();
}
