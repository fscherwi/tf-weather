var Tinkerforge = require('tinkerforge');

var LIGHT;
var BARO;
var HUMI;
var al;
var h;
var b;
var ipcon;
var Humidity;
var AirPressure;
var Temperature;
var Illuminance;
/* istanbul ignore next */
function ipcon_connect(HOST, PORT) {
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
  }, 250);
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
function tfdata_get() {
  h.getHumidity(
    function(humidity) {
      Humidity = humidity / 10;
    },
    function(error) {
      console.log('Relative Humidity: ' + 'Error ' + error);
    }
  );
  b.getAirPressure(
    function(air_pressure) {
      AirPressure = air_pressure / 1000;
    },
    function(error) {
      console.log('Air pressure: ' + 'Error ' + error);
    }
  );
  b.getChipTemperature(
    function(temperature) {
      Temperature = temperature / 100;
    },
    function(error) {
      console.log('Temperature: ' + 'Error ' + error);
    }
  );
  al.getIlluminance(
    function(illuminance) {
      Illuminance = illuminance / 10;
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
      tfdata_get();
      setInterval(function() {
        console.log('\033[2J');
        console.log('Relative Humidity: ' + Humidity + ' %RH');
        console.log('Air pressure:      ' + AirPressure + ' mbar');
        console.log('Temperature:       ' + Temperature + ' \u00B0C');
        console.log('Illuminance:       ' + Illuminance + ' Lux');
        tfdata_get();
      }, WAIT);
    } else {
      ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
        function(connectReason) {
          tfdata_get();
        }
      );
      setTimeout(function() {
        console.log('');
        console.log('Relative Humidity: ' + Humidity + ' %RH');
        console.log('Air pressure:      ' + AirPressure + ' mbar');
        console.log('Temperature:       ' + Temperature + ' \u00B0C');
        console.log('Illuminance:       ' + Illuminance + ' Lux');
        console.log('');
        ipcon.disconnect();
        process.exit(0);
      }, 50);
    }
  }, 300);
};
