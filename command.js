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
  .option('get', 'Get UIDs of BRICKLETs!')
  .option('info', 'Show configured UIDs!')
  .parse(process.argv);
/* istanbul ignore next */
if (!program.args.length) {
  if (program.get) {
    require('./get.js').get();
  } else {
    require("./json.js");

    var w = require('./weather.js');

    if (program.info) {
      require('./info.js').info();
    } else if (program.live) {
      w.tflive();
    } else {
      w.tfsimple();
    }
  }

} else {
  program.help();
}
