var WAIT;
var HOST;
var PORT;

var BARO;
var HUMI;
var LIGHT;

var config_json;

function get() {
  config_json = require(require('os-homedir')() + '/.tf_config.json');

  WAIT = parseInt(config_json.wait);
  HOST = config_json.host;
  PORT = parseInt(config_json.port);

  BARO = config_json.baro;
  HUMI = config_json.humi;
  LIGHT = config_json.light;
}

function show() {
  console.log("HOST: " + HOST);
  console.log("PORT: " + PORT);
  console.log("WAIT: " + WAIT);
  console.log("");
  console.log("LIGHT UID: " + LIGHT);
  console.log("BARO UID: " + BARO);
  console.log("HUMI UID: " + HUMI);
}

function info() {
  get();
  show();
  process.exit(0);
}

exports.info = info;
