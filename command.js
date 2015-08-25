#!/usr/bin/env node

var program = require('commander');
var w;
var g;
var i;
var test;

program
  .version(require('./package.json').version)
  .usage('[options]')
  .option('-l, --live', 'Shows the live weather')
  .option('-h, --host [host]', 'The HOST, default to "localhost"')
  .option('-p, --port [port]', 'The PORT, default to "4223"', parseInt)
  .option('-w, --wait [time]', 'The Callback time', parseInt)
  .option('get', 'Get UIDs of BRICKLETs!')
  .option('info', 'Show configured UIDs!')
  .parse(process.argv);

if (!program.args.length) {
  test = require('./test.js');
  test.test_config_file();

  if (program.get) {
    g = require('./get.js');
    g.get();
  } else {
    w = require('./weather.js');
    i = require('./info.js');

    i.test();
    if (program.info) {
      i.info();
    } else if (program.live) {
      w.tflive();
    } else {
      w.tfsimple();
    }
  }

} else {
  program.help();
}
