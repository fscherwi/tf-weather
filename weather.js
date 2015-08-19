var LIGHT = require('./uids.json').light;
var BARO = require('./uids.json').baro;
var HUMI = require('./uids.json').humi;

var rh;
var ap;
var temp;
var ilu;

var Tinkerforge = require('tinkerforge');
var program = require('commander');

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

var ipcon = new Tinkerforge.IPConnection();
var al = new Tinkerforge.BrickletAmbientLight(LIGHT, ipcon);
var b = new Tinkerforge.BrickletBarometer(BARO, ipcon);
var h = new Tinkerforge.BrickletHumidity(HUMI, ipcon);

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

if (al === undefined && b === undefined && h === undefined) {
  console.log("Didn't find correct Bricklets");
  process.exit();
} else {

  ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function(connectReason) {
      h.getHumidity(
        function(humidity) {
          rh = humidity / 10;
          console.log('Relative Humidity: ' + rh + ' %RH');
        },
        function(error) {
          process.stdout.write('Error: ' + error);
        }
      );
      b.getAirPressure(
        function(air_pressure) {
          ap = air_pressure / 1000;
          console.log('Air pressure: ' + ap + ' mbar');
        },
        function(error) {
          process.stdout.write('Error: ' + error);
        }
      );
      b.getChipTemperature(
        function(temperature) {
          temp = temperature / 100;
          console.log('Temperature: ' + temp + ' \u00B0C');
        },
        function(error) {
          console.log('Error: ' + error);
        }
      );
      al.getIlluminance(
        function(illuminance) {
          ilu = illuminance / 10;
          console.log('Illuminance: ' + ilu + ' Lux');
        },
        function(error) {
          process.stdout.write('Error: ' + error);
        }
      );
    }
  );
}
