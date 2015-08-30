// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';

import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

const that = {
   now() {
      return new Date().getTime()
   },
   formatShortISO(value) {
      assert(value);
      assert(value.constructor.name === 'Date');
      return value.toISOString().substring(0, 16);
   }
}

module.exports = that;
