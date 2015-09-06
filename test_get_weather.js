/* istanbul ignore next */
var get_weather = require('./get_weather.js');
/* istanbul ignore next */
var config_json = require(require('os-homedir')() + '/.tf_config.json');
/* istanbul ignore next */
get_weather.uids(light_uid = config_json.light, baro_uid = config_json.baro, humi_uid = config_json.humi);
/* istanbul ignore next */
get_weather.connect(host = config_json.host, port = parseInt(config_json.port));
/* istanbul ignore next */
console.log(get_weather.Humidity());
