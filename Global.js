// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// warning this automatically loads a number of modules in global

global.assert = require('assert');
global.path = require('path');
global.lodash = require('lodash');
global._ = global.lodash;

global.Loggers = require('./Loggers');
Object.assign(global, require('./Utils'));

