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
  console.log("HOST: " + HOST);
  console.log("PORT: " + PORT);
  console.log("WAIT: " + WAIT);
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

exports.info = info;
