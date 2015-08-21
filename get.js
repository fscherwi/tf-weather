var fs = require('fs');
var Tinkerforge = require('tinkerforge');
var program = require('commander');

var LIGHT;
var BARO;
var HUMI;

var ipcon;

var outputFilename = './uids.json';

if (program.host) {
  var HOST = program.host;
} else {
  var HOST = "localhost";
}
if (program.port) {
  var PORT = program.port;
} else {
  var PORT = 4223;
}

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

function tfget() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier) {
      if (deviceIdentifier === Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER) {
        LIGHT = uid;
        console.log("LIGHT: " + LIGHT);
      } else if (deviceIdentifier === Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER) {
        BARO = uid;
        console.log("BARO: " + BARO);
      } else if (deviceIdentifier === Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER) {
        HUMI = uid;
        console.log("HUMI: " + HUMI);
      }
    }
  );
}

function jsonwrite() {
  if (LIGHT === undefined | BARO === undefined | HUMI === undefined) {
    console.log('Error: not the right Bricklets connected')
    process.exit(0);
  } else {
    fs.writeFile(outputFilename, JSON.stringify({
      light: LIGHT,
      baro: BARO,
      humi: HUMI
    }, null, 4), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Succefully configured UIDs!");
        process.exit(0);
      }
    });
  }
}

tfinit();
tfget();
setTimeout(function() {
  jsonwrite();
}, 500);
