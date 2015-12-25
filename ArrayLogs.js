// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function mapMatching(array, regex) {
   if (lodash.isEmpty(array)) {
      return 'empty~array';
   } else {
      return Object.keys(object).join(' ');
   }
}

export function formatType(object) {
   if (!object) {
      return 'empty~object';
   } else {
      return Object.keys(object).join(' ');
   }
}
