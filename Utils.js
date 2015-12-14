// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// warning this automatically loads a number of modules in global

const startTime = new Date().getTime();

['assert', 'lodash', 'path'].forEach(moduleName => {
   module.exports[moduleName] = require(moduleName);
});

module.exports._ = module.exports.lodash;

global.Loggers = require('./Loggers');

['Arguments', 'Arrays', 'Asserts', 'Collections', 'Dates', 'Errors',
   'Maps', 'Millis', 'Maybe', 'Numbers', 'Objects',
   'Paths', 'Promises', 'Requests', 'Seconds', 'Strings',
   'Zlib'
   ].forEach(moduleName => {
      module.exports[moduleName] = require('./' + moduleName);
});

export function assign() {
   global.Loggers = require('./Loggers');
   global.Arguments = require('./Arguments');
   global.Arrays = require('./Arrays');
   global.Asserts = require('./Asserts');
   global.Dates = require('./Dates');
   global.Maps = require('./Maps');
   global.Millis = require('./Millis');
   global.Numbers = require('./Numbers');
   global.Objects = require('./Objects');
   global.Seconds = require('./Seconds');
   global.Strings = require('./Strings');
}
