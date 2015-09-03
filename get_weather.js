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

function tfconnect() {
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
}

function getHumidity() {
  h.getHumidity(
    function(humidity) {
      var rh = humidity / 10;
      Humidity = rh;
    },
    function(error) {
      console.log('Relative Humidity: ' + 'Error ' + error);
    }
  );
}

function getAirPressure() {
  b.getAirPressure(
    function(air_pressure) {
      var ap = air_pressure / 1000;
      AirPressure = ap;
    },
    function(error) {
      console.log('Air pressure: ' + 'Error ' + error);
    }
  );
}

function getTemperature() {
  b.getChipTemperature(
    function(temperature) {
      var temp = temperature / 100;
      Temperature = temp;
    },
    function(error) {
      console.log('Temperature: ' + 'Error ' + error);
    }
  );
}

function getIlluminance() {
  al.getIlluminance(
    function(illuminance) {
      var ilu = illuminance / 10;
      return Illuminance;
    },
    function(error) {
      process.stdout.write('Illuminance: ' + 'Error ' + error);
    }
  );
}

tfconnect();

module.exports.Humidity = Humidity;
module.exports.AirPressure = AirPressure;
module.exports.Temperature = Temperature;
module.exports.Illuminance = Illuminance;
