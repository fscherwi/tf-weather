var Tinkerforge = require('tinkerforge'),
  LIGHT, LIGHT_2, BARO, HUMI, al, h, b, ipcon, output_data = [];
/* istanbul ignore next */
function ipcon_connect(HOST, PORT) {
  ipcon.connect(HOST, PORT,
    function (error) {
      console.log(error_output(error));
      process.exit();
    }
  );
}
/* istanbul ignore next */
function get_uid(HOST, PORT) {
  ipcon = new Tinkerforge.IPConnection();
  ipcon_connect(HOST, PORT);
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function () {
      ipcon.enumerate();
    }
  );
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function (uid, a, b, c, d, deviceIdentifier) {
      switch (deviceIdentifier) {
      case Tinkerforge.BrickletAmbientLight.DEVICE_IDENTIFIER:
        LIGHT = uid;
        break;
      case Tinkerforge.BrickletAmbientLightV2.DEVICE_IDENTIFIER:
        LIGHT_2 = uid;
        break;
      case Tinkerforge.BrickletBarometer.DEVICE_IDENTIFIER:
        BARO = uid;
        break;
      case Tinkerforge.BrickletHumidity.DEVICE_IDENTIFIER:
        HUMI = uid;
        break;
      }
    }
  );
}
/* istanbul ignore next */
function tfinit(HOST, PORT) {
  if (LIGHT_2 || LIGHT || BARO || HUMI) {
    ipcon = new Tinkerforge.IPConnection();
    if (LIGHT_2) {
      al = new Tinkerforge.BrickletAmbientLightV2(LIGHT, ipcon);
    } else if (LIGHT) {
      al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
    }
    if (BARO) {
      b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
    }
    if (HUMI) {
      h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);
    }
    ipcon_connect(HOST, PORT);
  } else {
    console.log('ERROR: nothing connected');
    process.exit();
  }
}
/* istanbul ignore next */
function tfdata_get() {
  if (h) {
    h.getHumidity(
      function (humidity) {
        output_data[0] =  humidity / 10 + ' %RH';
      },
      function (error) {
        output_data[0] =  error_output(error);
      }
    );
  }
  if (b) {
    b.getAirPressure(
      function (air_pressure) {
        output_data[1] =  air_pressure / 1000 + ' mbar';
      },
      function (error) {
        output_data[1] = error_output(error);
      }
    );
    b.getChipTemperature(
      function (temperature) {
        output_data[2] =  temperature / 100 + ' \u00B0C';
      },
      function (error) {
        output_data[2] =  error_output(error);
      }
    );
  }
  if (al) {
    al.getIlluminance(
      function (illuminance) {
        output_data[3] =  illuminance / 10 + ' Lux';
      },
      function (error) {
        output_data[3] =  error_output(error);
      }
    );
  }
}
/* istanbul ignore next */
function getTime(date) {
  return ((date.getHours() < 10 ? '0' : '') + date.getHours()) + ':' + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()) + ':' + ((date.getSeconds() < 10 ? '0' : '') + date.getSeconds());
}
/* istanbul ignore next */
function error_output(code) {
  switch (code) {
  case 11:
    return 'Error: ALREADY CONNECTED';
  case 12:
    return 'Error: NOT CONNECTED';
  case 13:
    return 'Error: CONNECT FAILED';
  case 21:
    return 'Error: INVALID FUNCTION ID';
  case 31:
    return 'Error: TIMEOUT';
  case 41:
    return 'Error: INVALID PARAMETER';
  case 42:
    return 'Error: FUNCTION NOT SUPPORTED';
  default:
    return 'Error: UNKNOWN ERROR';
  }
}
/* istanbul ignore next */
exports.get = function tfget(HOST, PORT, WAIT, live) {
  get_uid(HOST, PORT);
  if (live) {
    setTimeout(function () {
      ipcon.disconnect();
      tfinit(HOST, PORT);
    }, 150);
    setTimeout(function () {
      process.stdin.on('data',
        function () {
          ipcon.disconnect();
          process.exit();
        }
      );
      tfdata_get();
      setInterval(function () {
        tfdata_get();
        console.log('\033[2J');
        console.log('Relative Humidity:\t' + output_data[0]);
        console.log('Air pressure:\t\t' + output_data[1]);
        console.log('Temperature:\t\t' + output_data[2]);
        console.log('Illuminance:\t\t' + output_data[3]);
        console.log('\nTime:\t\t\t' + getTime(new Date()));
      }, WAIT);
    }, 25);
  } else {
    setTimeout(function () {
      tfinit(HOST, PORT);
      ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
        function () {
          tfdata_get();
        }
      );
      setTimeout(function () {
        console.log('');
        console.log('Relative Humidity:\t' + output_data[0]);
        console.log('Air pressure:\t\t' + output_data[1]);
        console.log('Temperature:\t\t' + output_data[2]);
        console.log('Illuminance:\t\t' + output_data[3]);
        console.log('\nTime:\t\t\t' + getTime(new Date()));
        console.log('');
        ipcon.disconnect();
        process.exit(0);
      }, 10);
    }, 25);
  }
};
