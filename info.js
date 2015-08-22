var light;
var baro;
var humi;

var host;
var port;
var wait;

function get() {
  light = require('./config.json').light;
  baro = require('./config.json').baro;
  humi = require('./config.json').humi;

  host = require('./config.json').host;
  port = require('./config.json').port;
  wait = require('./config.json').wait;
}

function show() {
  console.log("HOST: " + host);
  console.log("PORT: " + port);
  console.log("WAIT: " + wait);
  console.log("");
  console.log("LIGHT UID: " + light);
  console.log("BARO UID: " + baro);
  console.log("HUMI UID: " + humi);
}

function info() {
  get();
  show();
  process.exit(0);
}

function test() {
  get();
  if (light === undefined) {
    console.log("Not correct configure, run 'weather get'!");
    process.exit(0);
  } else if (baro === undefined) {
    console.log("Not correct configure, run 'weather get'!");
    process.exit(0);
  } else if (humi === undefined) {
    console.log("Not correct configure, run 'weather get'!");
    process.exit(0);
  } else if (host === undefined) {
    console.log("Not correct configure, run 'weather get'!");
    process.exit(0);
  } else if (port === undefined) {
    console.log("Not correct configure, run 'weather get'!");
    process.exit(0);
  } else if (wait === undefined) {
    console.log("Not correct configure, run 'weather get'!");
    process.exit(0);
  }
}

exports.info = info;
exports.test = test;
