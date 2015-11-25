var Tinkerforge = require('tinkerforge');
var program = require('commander');

var HOST = "localhost";
var PORT = 4223;

var ipcon;

/*if (program.host) {
  HOST = program.host;
} else {
  HOST = "localhost";
}
if (program.port) {
  PORT = program.port;
} else {
  PORT = 4223;
}
*/
function tfconnect() {
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
function humi() {
  tfconnect();
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier) {
      if (deviceIdentifier === Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER) {
        return uid;
      }
    }
  );
}
/* istanbul ignore next */
function light() {
  tfconnect();
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier) {
      if (deviceIdentifier === Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER) {
        return uid;
      }
    }
  );
}
/* istanbul ignore next */
function baro() {
  tfconnect();
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier) {
      if (deviceIdentifier === Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER) {
        return uid;
      }
    }
  );
}
/* istanbul ignore next */
exports.humi = humi;
exports.light = light;
exports.baro = baro;
