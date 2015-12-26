# tf-weather
[![Build Status](https://travis-ci.org/fscherwi/tf-weather.svg?branch=master)](https://travis-ci.org/fscherwi/tf-weather) [![Dependency Status](https://david-dm.org/fscherwi/tf-weather.svg)](https://david-dm.org/fscherwi/tf-weather) [![bitHound Score](https://www.bithound.io/github/fscherwi/tf-weather/badges/score.svg)](https://www.bithound.io/github/fscherwi/tf-weather) [![Code Climate](https://codeclimate.com/github/fscherwi/tf-weather/badges/gpa.svg)](https://codeclimate.com/github/fscherwi/tf-weather) [![Coverage Status](https://coveralls.io/repos/fscherwi/tf-weather/badge.svg?service=github)](https://coveralls.io/github/fscherwi/tf-weather) [![Codacy Badge](https://api.codacy.com/project/badge/grade/627d96122a3541ecaa76fb5a76ec5b75)](https://www.codacy.com/app/fscherwi/tf-weather)

## Shows the current weather from Tinkerforge Sensors!
# Install
You may require sudo!

```sh
 $ npm install -g tf-weather
```

# Usage
## Simple show current weather

```sh
$ weather
```

### Options
**Custom HOST**

```sh
$ weather get -h <your-host>
```

**Custom PORT**

```sh
$ weather get -p <your-port>
```

## Advanced functions
### Show live weather

```sh
$ weather live
```
