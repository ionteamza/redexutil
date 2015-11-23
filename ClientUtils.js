// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// Warning: this automatically loads a number of modules in global

export function assign(g) {
   g.Arguments = require('./Arguments');
   g.Arrays = require('./Arrays');
   g.Asserts = require('./Asserts');
   g.Dates = require('./Dates');
   g.Maps = require('./Maps');
   g.Millis = require('./Millis');
   g.Numbers = require('./Numbers');
   g.Objects = require('./Objects');
   g.Seconds = require('./Seconds');
   g.Strings = require('./Strings');
}
