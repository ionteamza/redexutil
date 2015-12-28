// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function formatString(object) {
   let string;
   if (!object) {
      return 'empty~object';
   } else if (typeof object === 'string') {
      string = object;
   } else if (typeof object === 'object') {
      if (object.constructor) {
         return object.constructor.name + '~object';
      } else {
         logger.error('formatString', object);
         return object.toString();
      }
   } else if (lodash.isArray(object)) {
      return object.length + '~array';
   } else {
      string = object.toString();
   }
   if (/\s/.test(string)) {
      return 'string~' + string.length;
   } else {
      return string;
   }
}

export function formatKeys(object, predicate) {
   if (!object) {
      return 'empty~object';
   } else if (predicate) {
      return Objects.keys(object, predicate).join(' ');
   } else {
      return Object.keys(object).join(' ');
   }
}

export function formatValues(object, predicate) {
   if (!object) {
      return 'empty~object';
   } else {
      return Objects.keys(object, predicate).map(key => {
         let value = object[key];
         logger.warn('formatValues', key, value);
         return key + '@' + formatString(value);
      }).join(' ');
   }
}

export function formatType(object) {
   if (!object) {
      return 'empty~object';
   } else {
      return Object.keys(object).join(' ');
   }
}
