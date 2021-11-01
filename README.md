# tf-weather

![Build Status](https://github.com/fscherwi/tf-weather/actions/workflows/ci.yml/badge.svg)  [![Codacy Badge](https://api.codacy.com/project/badge/grade/627d96122a3541ecaa76fb5a76ec5b75)](https://www.codacy.com/app/fscherwi/tf-weather)

## Shows the current weather data from Tinkerforge Sensors!

# Install

You may require sudo!

```shell
 $ npm install -g tf-weather
```

# Usage

**Simple show current weather**

```shell
$ weather
```

**Show live weather**

```shell
$ weather --live
```

## Options

**Custom HOST**

```shell
$ weather get -h <your-host>
```

**Custom PORT**

```shell
$ weather get -p <your-port>
```

**Custom Callback period in live mode**

```shell
$ weather get -w <your-wait-period>
```
