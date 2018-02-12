// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// Warning: this automatically loads a number of modules in global

const Modules = require('./Modules');

module.exports = {
   Arguments: require('./Arguments'),
   ArrayLogs: require('./ArrayLogs'),
   Arrays: require('./Arrays'),
   Collections: require('./Collections'),
   Dates: require('./Dates'),
   Errors: require('./Errors'),
   ExpireMap: require('./ExpireMap'),
   Maps: require('./Maps'),
   Maybe: require('./Maybe'),
   Millis: require('./Millis'),
   Modules: require('./Modules'),
   Numbers: require('./Numbers'),
   ObjectLogs: require('./ObjectLogs'),
   Objects: require('./Objects'),
   Promises: require('./Promises'),
   Regexes: require('./Regexes'),
   Seconds: require('./Seconds'),
   Strings: require('./Strings'),
   Urls: require('./Urls')
};
