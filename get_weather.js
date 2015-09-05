var Tinkerforge = require('tinkerforge');

var config_json = require(require('os-homedir')() + '/.tf_config.json');

var HOST = config_json.host;
var PORT = parseInt(config_json.port);
var BARO = config_json.baro;
var HUMI = config_json.humi;
var LIGHT = config_json.light;

var ipcon = new Tinkerforge.IPConnection();
var al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
var b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
var h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);

var Humidity;
var AirPressure;
var Temperature;

/* istanbul ignore next */
ipcon.connect(HOST, PORT,
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
    process.exit();
  }
);
/* istanbul ignore next */
function getHumidity() {
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
}
/* istanbul ignore next */
function getAirPressure() {
  b.getAirPressure(
    function(air_pressure) {
      var ap = air_pressure / 1000;
      return ap;
    },
    function(error) {
      console.log('Air pressure: Error ' + error);
    }
  );
}
/* istanbul ignore next */
function getTemperature() {
  b.getChipTemperature(
    function(temperature) {
      var temp = temperature / 100;
      return temp;
    },
    function(error) {
      console.log('Temperature: Error ' + error);
    }
  );
}
/* istanbul ignore next */
function getIlluminance() {
  al.getIlluminance(
    function(illuminance) {
      var ilu = illuminance / 10;
      return Illuminance;
    },
    function(error) {
      process.stdout.write('Illuminance: Error ' + error);
    }
  );
}

module.exports.Humidity = getHumidity;
module.exports.AirPressure = getAirPressure;
module.exports.Temperature = getTemperature;
module.exports.Illuminance = getIlluminance;
