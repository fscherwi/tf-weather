var fs = require('fs');

function test_config_file() {
  try {
    config_file = fs.lstatSync(require('os-homedir')() + '/.tf_config.json');

    if (config_file.isFile()) {
    }
  } catch (e) {
    console.log("Did't found config file!");
    process.exit();
  }
}

function test_uids() {
  var config_json = require(require('os-homedir')() + '/.tf_config.json');

  if (config_json.light === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "1");
    process.exit(0);
  } else if (config_json.baro === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "12");
    process.exit(0);
  } else if (config_json.humi === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "13");
    process.exit(0);
  } else if (config_json.host === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "14");
    process.exit(0);
  } else if (parseInt(config_json.port) === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "15");
    process.exit(0);
  } else if (parseInt(config_json.wait) === undefined) {
    console.log("Not correct configure, run 'weather get'!" + "16");
    process.exit(0);
  }
}

exports.test_config_file = test_config_file;
exports.test_uids = test_uids;
