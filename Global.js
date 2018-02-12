// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

module.exports = {
  assert: require('assert'),
  path: require('path'),
  lodash: require('lodash'),
  Modules: require('./Modules')
};

module.exports._ = module.exports.lodash;

Object.assign(module.exports, module.exports.Modules.getDefaultExports({
  Arguments: require('./Arguments'),
  ArrayLogs: require('./ArrayLogs'),
  Arrays: require('./Arrays'),
  Asserts: require('./Asserts'),
  Collections: require('./Collections'),
  Dates: require('./Dates'),
  Errors: require('./Errors'),
  ExpireMap: require('./ExpireMap'),
  Maps: require('./Maps'),
  Maybe: require('./Maybe'),
  Millis: require('./Millis'),
  Numbers: require('./Numbers'),
  ObjectLogs: require('./ObjectLogs'),
  Objects: require('./Objects'),
  Paths: require('./Paths'),
  Promises: require('./Promises'),
  Regexes: require('./Regexes'),
  Requests: require('./Requests'),
  Seconds: require('./Seconds'),
  Stats: require('./Stats'),
  Strings: require('./Strings'),
  Urls: require('./Urls')
});
