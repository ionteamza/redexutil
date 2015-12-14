// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// warning this automatically loads a number of modules in global

global.Loggers = require('./Loggers');

Object.assign(global, require('./Utils'));

