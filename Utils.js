// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// warning this automatically loads a number of modules in global

const startTime = new Date().getTime();

['assert', 'lodash', 'path'].forEach(moduleName => {
   module.exports[moduleName] = require(moduleName);
});

module.exports._ = module.exports.lodash;

['Arguments', 'Arrays', 'Asserts', 'Collections', 'Dates', 'Errors',
   'Loggers', 'Maps', 'Millis', 'Maybe', 'Numbers', 'Objects',
   'Paths', 'Promises', 'Requests', 'Seconds', 'Strings',
   'Zlib'
   ].forEach(moduleName => {
      module.exports[moduleName] = require('./' + moduleName);
});
