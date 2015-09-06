var get_weather = require('./get_weather.js');
var config_json = require(require('os-homedir')() + '/.tf_config.json');

get_weather.uids(light_uid = config_json.light, baro_uid = config_json.baro, humi_uid = config_json.humi);
get_weather.connect(host = config_json.host, port = parseInt(config_json.port));

console.log(get_weather.Humidity());
