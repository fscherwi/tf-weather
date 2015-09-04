function test_json () {
  var fs = require('fs');

  try {
    var config_file = fs.lstatSync(require('os-homedir')() + '/.tf_config.json');

    if (config_file.isFile()) {}
  } catch (e) {
    console.log("Did't found config file!");
    process.exit();
  }

  var config_json = require(require('os-homedir')() + '/.tf_config.json');

  if (config_json.light === undefined) {
    console.log("Not correct configured, run 'weather get'!");
    process.exit(1);
  } else if (config_json.baro === undefined) {
    console.log("Not correct configured, run 'weather get'!");
    process.exit(1);
  } else if (config_json.humi === undefined) {
    console.log("Not correct configured, run 'weather get'!");
    process.exit(1);
  } else if (config_json.host === undefined) {
    console.log("Not correct configured, run 'weather get'!");
    process.exit(1);
  } else if (parseInt(config_json.port) === undefined) {
    console.log("Not correct configured, run 'weather get'!");
    process.exit(1);
  } else if (parseInt(config_json.wait) === undefined) {
    console.log("Not correct configured, run 'weather get'!");
    process.exit(1);
  }
}

exports.test_json = test_json;
