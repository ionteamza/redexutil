// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';
import Loggers from './Loggers';

const logger = Loggers.create(__filename, 'info');

export function time() {
   return new Date().getTime()
}

export function formatShortISO(value) {
   assert(value);
   assert(value.constructor.name === 'Date');
   return value.toISOString().substring(0, 16);
}
