var fs = require('fs');
var Tinkerforge = require('tinkerforge');
var program = require('commander');

var LIGHT;
var BARO;
var HUMI;
var HOST;
var PORT;
var WAIT;

var ipcon;

var config_json = require('os-homedir')() + '/.tf_config.json';

if (program.host) {
  HOST = program.host;
} else {
  HOST = "localhost";
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
/* istanbul ignore next */
function tfinit() {
  ipcon = new Tinkerforge.IPConnection();
  ipcon.connect(HOST, PORT,
    function(error) {
      console.log('Error: ' + error);
    }
  );

  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      ipcon.enumerate();
    }
  );
}
/* istanbul ignore next */
function tfget() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier) {
      if (deviceIdentifier === Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER) {
        LIGHT = uid;
      } else if (deviceIdentifier === Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER) {
        BARO = uid;
      } else if (deviceIdentifier === Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER) {
        HUMI = uid;
      }
    }
  );
}
/* istanbul ignore next */
function showinfo() {
  console.log("HOST: " + HOST);
  console.log("PORT: " + PORT);
  console.log("WAIT: " + WAIT);
  console.log("LIGHT: " + LIGHT);
  console.log("BARO: " + BARO);
  console.log("HUMI: " + HUMI);
}
/* istanbul ignore next */
function jsonavaible() {
  try {
    if (config_json.isFile()) {}
  } catch (e) {
    fs.writeFile(config_json, "{}", function(err) {
      if (err) {
        return console.log(err);
      }
    });
  }
}
/* istanbul ignore next */
function jsonwrite() {
  if (LIGHT === undefined || BARO === undefined || HUMI === undefined) {
    console.log('Error: not the right Bricklets connected');
    process.exit(1);
  } else {
    showinfo();
    fs.writeFile(config_json, JSON.stringify({
      light: LIGHT,
      baro: BARO,
      humi: HUMI,
      host: HOST,
      port: PORT,
      wait: WAIT
    }, null, 4), function(err) {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.log("");
        console.log("Succefully configured!");
        ipcon.disconnect();
        process.exit(0);
      }
    });
  }
}
/* istanbul ignore next */
function get() {
  tfinit();
  tfget();
  jsonavaible();
  setTimeout(function() {
    jsonwrite();
  }, 500);
}

exports.get = get;
