var WAIT;
var HOST;
var PORT;

var BARO;
var HUMI;
var LIGHT;

function get() {
  if (require(require('os-homedir')() + '/.tf_config.json') === undefined) {
    console.log("ERROR!");
    console.log("Didn't found config file!");
    process.exit();
  } else {
    config_json = require(require('os-homedir')() + '/.tf_config.json');
  }

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

function test() {
  get();
  if (LIGHT === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "1");
    process.exit(0);
  } else if (BARO === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "12");
    process.exit(0);
  } else if (HUMI === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "13");
    process.exit(0);
  } else if (HOST === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "14");
    process.exit(0);
  } else if (PORT === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "15");
    process.exit(0);
  } else if (WAIT === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "16");
    process.exit(0);
  }
}

exports.info = info;
exports.test = test;
