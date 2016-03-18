// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function formatProps(array, predicate) {
   if (lodash.isEmpty(array)) {
      return 'empty~array';
   } else if (!lodash.isArray(array)) {
      return 'invalid~array';
   } else {
      return array.map(item => Objects.keys(item, predicate)
      .map(key => '@' + key + '=' + ObjectLogs.format(item[key])).join(' '));
   }
}

export function length(array) {
   if (lodash.isEmpty(array)) {
      return 'empty~array';
   } else if (!lodash.isArray(array)) {
      return 'invalid~array';
   } else {
      return array.length;
   }
}

export function first(array, predicate) {
   if (lodash.isEmpty(array)) {
      return 'empty~array';
   } else if (!lodash.isArray(array)) {
      return 'invalid~array';
   } else {
      return ObjectLogs.formatValues(array[0], predicate);
   }
}
