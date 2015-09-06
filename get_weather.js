var Tinkerforge = require('tinkerforge');

var ipcon;
var al;
var b;
var h;
/* istanbul ignore next */
function uids(light_uid, baro_uid, humi_uid) {
  ipcon = new Tinkerforge.IPConnection();
  al = new Tinkerforge.BrickletAmbientLight(light_uid, ipcon);
  b = new Tinkerforge.BrickletBarometer(baro_uid, ipcon);
  h = new Tinkerforge.BrickletHumidity(humi_uid, ipcon);
}
/* istanbul ignore next */
function connect(host, port) {
  ipcon.connect(host, port,
    function(error) {
      if (error === 11) {
        console.log('Error: ALREADY CONNECTED');
      } else if (error === 12) {
        console.log('Error: NOT CONNECTED');
      } else if (error === 13) {
        console.log('Error: CONNECT FAILED');
      } else if (error === 21) {
        console.log('Error: INVALID FUNCTION ID');
      } else if (error === 31) {
        console.log('Error: TIMEOUT');
      } else if (error === 41) {
        console.log('Error: INVALID PARAMETER');
      } else if (error === 42) {
        console.log('Error: FUNCTION NOT SUPPORTED');
      } else {
        console.log('Error: UNKNOWN ERROR');
      }
      process.exit(1);
    }
  );
}
/* istanbul ignore next */
function getHumidity() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      h.getHumidity(
        function(humidity) {
          var rh = humidity / 10;
          return rh;
        },
        function(error) {
          console.log('Relative Humidity: Error ' + error);
          ipcon.disconnect();
        }
      );
    });
}
/* istanbul ignore next */
function getAirPressure() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      b.getAirPressure(
        function(air_pressure) {
          var ap = air_pressure / 1000;
          return ap;
        },
        function(error) {
          console.log('Air pressure: Error ' + error);
        }
      );
    });
}
/* istanbul ignore next */
function getTemperature() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      b.getChipTemperature(
        function(temperature) {
          var temp = temperature / 100;
          return temp;
        },
        function(error) {
          console.log('Temperature: Error ' + error);
        }
      );
    });
}
/* istanbul ignore next */
function getIlluminance() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      al.getIlluminance(
        function(illuminance) {
          var ilu = illuminance / 10;
          return ilu;
        },
        function(error) {
          process.stdout.write('Illuminance: Error ' + error);
        }
      );
    });
}
/* istanbul ignore next */
module.exports.get_uids = uids;
/* istanbul ignore next */
module.exports.connect = connect;
/* istanbul ignore next */
module.exports.Humidity = getHumidity;
/* istanbul ignore next */
module.exports.AirPressure = getAirPressure;
/* istanbul ignore next */
module.exports.Temperature = getTemperature;
/* istanbul ignore next */
module.exports.Illuminance = getIlluminance;
