// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';

import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

export function formatNullable(value) {
   if (value) {
      return value;
   } else {
      return '';
   }
}
