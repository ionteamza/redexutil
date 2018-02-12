// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function formatProps(array, predicate) {
   if (lodash.isEmpty(array)) {
      return 'empty[]';
   } else if (!lodash.isArray(array)) {
      return 'invalid[]';
   } else {
      return array.map(item => Objects.keys(item, predicate)
      .map(key => key + '=' + ObjectLogs.format(item[key])).join(' '));
   }
}

export function length(array) {
   if (lodash.isEmpty(array)) {
      return 'empty[]';
   } else if (!lodash.isArray(array)) {
      return 'invalid[]';
   } else {
      return array.length;
   }
}

export function slice(array, begin, end) {
   if (lodash.isEmpty(array)) {
      return 'empty[]';
   } else if (!lodash.isArray(array)) {
      return 'invalid[]';
   } else if (end && array.length < end) {
      return array.slice(begin);
   } else {
      return array.slice(begin, end);
   }
}

export function toString(array) {
   if (lodash.isEmpty(array)) {
      return 'empty[]';
   } else if (!lodash.isArray(array)) {
      return 'invalid[]';
   } else if (array.length < 25) {
      return array.slice(0).join(' ');
   } else {
      return `[${array.length}] ${array.slice(0, 15).join(' ')} ... ${array.slice(array.length - 5).join(' ')}`;
   }
}

export function first(array, predicate) {
   if (lodash.isEmpty(array)) {
      return 'empty[]';
   } else if (!lodash.isArray(array)) {
      return 'invalid[]';
   } else {
      return ObjectLogs.formatValues(array[0], predicate);
   }
}
