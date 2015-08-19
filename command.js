#!/usr/bin/env node

var program = require('commander');

program
  .version(require('./package.json').version)
  .usage('[options]')
  .option('-h, --host [host]', 'The HOST, default to "localhost"')
  .option('-p, --port [port]', 'The PORT, default to "4223"', parseInt)
  .option('-w, --wait [time]', 'The Callback time', parseInt)
  .option('get', 'Get UIDs of BRICKs!')
  .parse(process.argv);

if (!program.args.length) {

  if (program.get) {
    console.log("GET");

    process.exit(0);

  } else {
    require('weather.js');
    }
  }

} else {
  program.help();
}

process.stdin.on('data',
  function(data) {
    ipcon.disconnect();
    process.exit(0);
  }
);
