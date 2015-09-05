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

function tfinit() {
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
      process.exit(1);
    }
  );
}

function tfdata() {
  /* istanbul ignore next */
  h.getHumidity(
    function(humidity) {
      var rh = humidity / 10;
      console.log('Relative Humidity: ' + rh + ' %RH');
    },
    function(error) {
      console.log('Relative Humidity: ' + 'Error ' + error);
    }
  );
  /* istanbul ignore next */
  b.getAirPressure(
    function(air_pressure) {
      var ap = air_pressure / 1000;
      console.log('Air pressure:      ' + ap + ' mbar');
    },
    function(error) {
      console.log('Air pressure: ' + 'Error ' + error);
    }
  );
  /* istanbul ignore next */
  b.getChipTemperature(
    function(temperature) {
      var temp = temperature / 100;
      console.log('Temperature:       ' + temp + ' \u00B0C');
    },
    function(error) {
      console.log('Temperature: ' + 'Error ' + error);
    }
  );
  /* istanbul ignore next */
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

function tfsimple() {
  tfinit();
  console.log("");
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      tfdata();
    }
  );
  setTimeout(function() {
    console.log("");
    process.exit();
  }, 500);
}

function tflive() {
  tfinit();
  end();
  var async = require('async');
  var WAIT = parseInt(config_json.wait);
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
      console.log("ERROR: " + err);
      process.exit();
    }
  );
}

function end() {
  process.stdin.on('data',
    function(data) {
      ipcon.disconnect();
      process.exit(0);
    }
  );
}

exports.tfsimple = tfsimple;
exports.tflive = tflive;
