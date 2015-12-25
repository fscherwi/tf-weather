var Tinkerforge = require('tinkerforge');

var LIGHT;
var BARO;
var HUMI;
var al;
var h;
var b;
var ipcon;
/* istanbul ignore next */
function get(HOST, PORT) {
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
  setTimeout(function() {
    ipcon.disconnect();
  }, 500);
}
/* istanbul ignore next */
function tfinit(HOST, PORT) {
  ipcon = new Tinkerforge.IPConnection();
  al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
  b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
  h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);

  ipcon.connect(HOST, PORT,
    function(error) {
      switch (error) {
        case 11:
          console.log('Error: ALREADY CONNECTED');
          break;
        case 12:
          console.log('Error: NOT CONNECTED');
          break;
        case 13:
          console.log('Error: CONNECT FAILED');
          break;
        case 21:
          console.log('Error: INVALID FUNCTION ID');
          break;
        case 31:
          console.log('Error: TIMEOUT');
          break;
        case 41:
          console.log('Error: INVALID PARAMETER');
          break;
        case 42:
          console.log('Error: FUNCTION NOT SUPPORTED');
          break;
        default:
          console.log('Error: UNKNOWN ERROR');
          break;
      }
      process.exit();
    }
  );
}
/* istanbul ignore next */
function tfdata() {
  h.getHumidity(
    function(humidity) {
      var rh = humidity / 10;
      console.log('Relative Humidity: ' + rh + ' %RH');
    },
    function(error) {
      console.log('Relative Humidity: ' + 'Error ' + error);
    }
  );
  b.getAirPressure(
    function(air_pressure) {
      var ap = air_pressure / 1000;
      console.log('Air pressure:      ' + ap + ' mbar');
    },
    function(error) {
      console.log('Air pressure: ' + 'Error ' + error);
    }
  );
  b.getChipTemperature(
    function(temperature) {
      var temp = temperature / 100;
      console.log('Temperature:       ' + temp + ' \u00B0C');
    },
    function(error) {
      console.log('Temperature: ' + 'Error ' + error);
    }
  );
  al.getIlluminance(
    function(illuminance) {
      var ilu = illuminance / 10;
      console.log('Illuminance:       ' + ilu + ' Lux');
    },
    function(error) {
      process.stdout.write('Illuminance: ' + 'Error ' + error);
    }
  );
}
/* istanbul ignore next */
function tfsimple(HOST, PORT) {
  get(HOST, PORT);
  setTimeout(function() {
    tfinit(HOST, PORT);
    ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
      function(connectReason) {
        tfdata();
      }
    );
    setTimeout(function() {
      console.log('');
      ipcon.disconnect();
      process.exit(0);
    }, 500);
  }, 1000);
}
/* istanbul ignore next */
function tflive(HOST, PORT, WAIT) {
  get(HOST, PORT);
  setTimeout(function() {
    tfinit(HOST, PORT);
    process.stdin.on('data',
      function(data) {
        ipcon.disconnect();
        process.exit(0);
      }
    );
    var async = require('async');
    async.whilst(
      function() {
        return true;
      },
      function(callback) {
        console.log('\033[2J');
        tfdata();
        setTimeout(callback, WAIT);
      },
      function(err) {
        console.log('ERROR: ' + err);
        process.exit();
      }
    );
  }, 1000);
}
/* istanbul ignore next */
exports.tfsimple = tfsimple;
/* istanbul ignore next */
exports.tflive = tflive;
