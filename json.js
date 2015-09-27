var fs = require('fs');
var config_file = fs.lstatSync(require('os-homedir')() + '/.tf_config.json');
/* istanbul ignore next */
try {
  if (config_file.isFile()) {}
} catch (e) {
  fs.writeFile(config_json, "{}", function(err) {
    if (err) {
      return console.log(err);
    }
  });
}
