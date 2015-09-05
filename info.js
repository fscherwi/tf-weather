/* istanbul ignore next */
function info() {
  var config_json = require(require('os-homedir')() + '/.tf_config.json');

  console.log("HOST: " + config_json.host);
  console.log("PORT: " + parseInt(config_json.port));
  console.log("WAIT: " + parseInt(config_json.wait));
  console.log("");
  console.log("LIGHT UID: " + config_json.light);
  console.log("BARO UID: " + config_json.baro);
  console.log("HUMI UID: " + config_json.humi);

  process.exit(0);
}

exports.info = info;
