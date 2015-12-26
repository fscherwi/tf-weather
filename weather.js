var Tinkerforge = require('tinkerforge');

var LIGHT;
var BARO;
var HUMI;
var al;
var h;
var b;
var ipcon;
/* istanbul ignore next */
function ipcon_connect(HOST, PORT) {
  ipcon.connect(HOST, PORT,
    function(error) {
      switch (error) {
        case 11:
          return console.log('Error: ALREADY CONNECTED');
        case 12:
          return console.log('Error: NOT CONNECTED');
        case 13:
          return console.log('Error: CONNECT FAILED');
        case 21:
          return console.log('Error: INVALID FUNCTION ID');
        case 31:
          return console.log('Error: TIMEOUT');
        case 41:
          return console.log('Error: INVALID PARAMETER');
        case 42:
          return console.log('Error: FUNCTION NOT SUPPORTED');
        default:
          return console.log('Error: UNKNOWN ERROR');
      }
      process.exit();
    }
  );
}
/* istanbul ignore next */
function get_uid(HOST, PORT) {
  ipcon = new Tinkerforge.IPConnection();
  ipcon_connect(HOST, PORT);
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
  ipcon_connect(HOST, PORT);
}
/* istanbul ignore next */
function tfdata() {
  h.getHumidity(
    function(humidity) {
      console.log('Relative Humidity: ' + humidity / 10 + ' %RH');
    },
    function(error) {
      console.log('Relative Humidity: ' + 'Error ' + error);
    }
  );
  b.getAirPressure(
    function(air_pressure) {
      console.log('Air pressure:      ' + air_pressure / 1000 + ' mbar');
    },
    function(error) {
      console.log('Air pressure: ' + 'Error ' + error);
    }
  );
  b.getChipTemperature(
    function(temperature) {
      console.log('Temperature:       ' + temperature / 100 + ' \u00B0C');
    },
    function(error) {
      console.log('Temperature: ' + 'Error ' + error);
    }
  );
  al.getIlluminance(
    function(illuminance) {
      console.log('Illuminance:       ' + illuminance / 10 + ' Lux');
    },
    function(error) {
      process.stdout.write('Illuminance: ' + 'Error ' + error);
    }
  );
}
/* istanbul ignore next */
exports.get = function tfget(HOST, PORT, WAIT, live) {
  get_uid(HOST, PORT);
  setTimeout(function() {
    tfinit(HOST, PORT);
    if (live === true) {
      process.stdin.on('data',
        function(data) {
          ipcon.disconnect();
          process.exit();
        }
      );
      setInterval(function() {
        console.log('\033[2J');
        tfdata();
      }, WAIT);
    } else {
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
    }
  }, 1000);
};
