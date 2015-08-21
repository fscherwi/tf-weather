var Tinkerforge = require('tinkerforge');
var program = require('commander');
var async = require('async');

if (program.host) {
  var HOST = program.host;
} else {
  var HOST = "localhost";
}
if (program.port) {
  var PORT = program.port;
} else {
  var PORT = 4223;
}

var LIGHT = require('./uids.json').light;
var BARO = require('./uids.json').baro;
var HUMI = require('./uids.json').humi;

var ipcon = new Tinkerforge.IPConnection();
var al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
var b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
var h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);

function tfinit() {
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

function tfdata() {
  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      h.getHumidity(
        function(humidity) {
          var rh = humidity / 10;
          console.log('Relative Humidity: ' + rh + ' %RH');
        },
        function(error) {
          process.stdout.write('Relative Humidity: ' + 'Error ' + error + '\n');
        }
      );
      b.getAirPressure(
        function(air_pressure) {
          var ap = air_pressure / 1000;
          console.log('Air pressure: ' + ap + ' mbar');
        },
        function(error) {
          process.stdout.write('Air pressure: ' + 'Error ' + error + '\n');
        }
      );
      b.getChipTemperature(
        function(temperature) {
          var temp = temperature / 100;
          console.log('Temperature: ' + temp + ' \u00B0C');
        },
        function(error) {
          console.log('Temperature: ' + 'Error ' + error);
        }
      );
      al.getIlluminance(
        function(illuminance) {
          var ilu = illuminance / 10;
          console.log('Illuminance: ' + ilu + ' Lux');
        },
        function(error) {
          process.stdout.write('Illuminance: ' + 'Error ' + error);
        }
      );
    }
  );
}

function tfsimple() {
  tfinit();
  end();
  tfdata();
}

function tflive() {
  tfinit();
  end();
  var async = require('async');
  if (program.wait) {
    var WAIT = program.wait;
  } else {
    var WAIT = 1000;
  }
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
exports.tfdata = tfdata;
exports.tflive = tflive;
