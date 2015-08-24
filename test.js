var fs = require('fs');

function test_config_file() {
  try {
    stats = fs.lstatSync(require('os-homedir')() + '/.tf_config.json');

    if (stats.isFile()) {
    }
  } catch (e) {
    console.log("Did't found config file!");
    process.exit();
  }
}

exports.test_config_file = test_config_file;
