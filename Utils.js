// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

module.exports = {
  assert: require('assert'),
  path: require('path'),
  lodash: require('lodash')
};

module.exports._ = module.exports.lodash;

Object.assign(module.exports, {
  Arguments: require('./Arguments'),
  Arrays: require('./Arrays'),
  Asserts: require('./Asserts'),
  Collections: require('./Collections'),
  Dates: require('./Dates'),
  Errors: require('./Errors'),
  Maps: require('./Maps'),
  Millis: require('./Millis'),
  Maybe: require('./Maybe'),
  Numbers: require('./Numbers'),
  Objects: require('./Objects'),
  Paths: require('./Paths'),
  Promises: require('./Promises'),
  Requests: require('./Requests'),
  Seconds: require('./Seconds'),
  Stats: require('./Stats'),
  Strings: require('./Strings')
});
