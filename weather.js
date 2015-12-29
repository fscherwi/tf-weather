var Tinkerforge = require('tinkerforge');

var LIGHT,
  BARO,
  HUMI,
  al,
  h,
  b,
  ipcon,
  Humidity,
  AirPressure,
  Temperature,
  Illuminance;
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
      Humidity = humidity / 10 + ' %RH';
    },
    function(error) {
      Humidity = 'Error ' + error;
    }
  );
  b.getAirPressure(
    function(air_pressure) {
      AirPressure = air_pressure / 1000 + ' mbar';
    },
    function(error) {
      AirPressure = 'Error ' + error;
    }
  );
  b.getChipTemperature(
    function(temperature) {
      Temperature = temperature / 100 + ' \u00B0C';
    },
    function(error) {
      Temperature = 'Error ' + error;
    }
  );
  al.getIlluminance(
    function(illuminance) {
      Illuminance = illuminance / 10 + ' Lux';
    },
    function(error) {
      Illuminance = 'Error ' + error;
    }
  );
}
/* istanbul ignore next */
function getTime(date) {
  return ((date.getHours() < 10 ? "0" : "") + date.getHours()) + ":" + ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes()) + ":" + ((date.getSeconds() < 10 ? "0" : "") + date.getSeconds());
}
/* istanbul ignore next */
function output() {
  console.log('Relative Humidity: ' + Humidity);
  console.log('Air pressure:      ' + AirPressure);
  console.log('Temperature:       ' + Temperature);
  console.log('Illuminance:       ' + Illuminance);
  console.log('\nTime:              ' + getTime(new Date()));
}
/* istanbul ignore next */
exports.get = function tfget(HOST, PORT, WAIT, live) {
  get_uid(HOST, PORT);
  if (live === true) {
    setTimeout(function() {
      setTimeout(function() {
        ipcon.disconnect();
        tfinit(HOST, PORT);
      }, 250);
      setTimeout(function() {
        process.stdin.on('data',
          function(data) {
            ipcon.disconnect();
            process.exit();
          }
        );
        tfdata_get();
        setInterval(function() {
          tfdata_get();
          console.log('\033[2J');
          output();
        }, WAIT);
      }, 300);
    }, 250);
  } else {
    setTimeout(function() {
      tfinit(HOST, PORT);
      ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
        function(connectReason) {
          tfdata_get();
        }
      );
      setTimeout(function() {
        console.log('');
        output();
        console.log('');
        ipcon.disconnect();
        process.exit(0);
      }, 25);
    }, 50);
  }
};
