var Tinkerforge = require('tinkerforge');
var LIGHT,
  LIGHT_2,
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
      console.log(require('./error.js').error(error));
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
      } else if (deviceIdentifier === Tinkerforge.BrickletAmbientLightV2.DEVICE_IDENTIFIER) {
        LIGHT_2 = uid;
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
  if (LIGHT_2 !== undefined) {
    al = new Tinkerforge.BrickletAmbientLightV2(LIGHT, ipcon);
  } else if (LIGHT !== undefined) {
    al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
  }
  if (BARO !== undefined) {
    b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
  }
  if (HUMI !== undefined) {
    h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);
  }
  ipcon_connect(HOST, PORT);
}
/* istanbul ignore next */
function tfdata_get() {
  if (h !== undefined) {
    h.getHumidity(
      function(humidity) {
        Humidity = humidity / 10 + ' %RH';
      },
      function(error) {
        Humidity = require('./error.js').error(error);
      }
    );
  }
  if (b !== undefined) {
    b.getAirPressure(
      function(air_pressure) {
        AirPressure = air_pressure / 1000 + ' mbar';
      },
      function(error) {
        AirPressure = require('./error.js').error(error);
      }
    );
    b.getChipTemperature(
      function(temperature) {
        Temperature = temperature / 100 + ' \u00B0C';
      },
      function(error) {
        Temperature = require('./error.js').error(error);
      }
    );
  }
  if (al !== undefined) {
    al.getIlluminance(
      function(illuminance) {
        Illuminance = illuminance / 10 + ' Lux';
      },
      function(error) {
        Illuminance = require('./error.js').error(error);
      }
    );
  }
}
/* istanbul ignore next */
function getTime(date) {
  return ((date.getHours() < 10 ? "0" : "") + date.getHours()) + ":" + ((date.getMinutes() < 10 ? "0" : "") + date.getMinutes()) + ":" + ((date.getSeconds() < 10 ? "0" : "") + date.getSeconds());
}
/* istanbul ignore next */
function output() {
  if (Humidity !== undefined) {
    console.log('Relative Humidity: ' + Humidity);
  }
  if (AirPressure !== undefined) {
    console.log('Air pressure:      ' + AirPressure);
  }
  if (Temperature !== undefined) {
    console.log('Temperature:       ' + Temperature);
  }
  if (Illuminance !== undefined) {
    console.log('Illuminance:       ' + Illuminance);
  }
  if (Humidity !== undefined || AirPressure !== undefined || Temperature !== undefined || Illuminance !== undefined) {
    console.log('\nTime:              ' + getTime(new Date()));
  } else {
    console.log('ERROR: nothing connected');
  }
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
