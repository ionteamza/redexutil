// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// warning this automatically loads a number of modules in global

export function assign() {
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
