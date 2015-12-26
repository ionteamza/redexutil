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
      return object.toString();
   }
   if (/\s/.test(string)) {
      return '"' + string + '"';
   } else {
      return string;
   }
}

export function formatKeys(object, predicate) {
   if (!object) {
      return 'empty~object';
   } else if (predicate) {
      if (lodash.isArray(predicate)) {
         return Object.keys(object).filter(key => lodash.includes(predicate, key)).join(' ');
      } else if (predicate.constructor && predicate.constructor.name === 'RegExp') {
         return Object.keys(object).filter(key => predicate.test(key)).join(' ');
      } else {
      }
   }
   return Object.keys(object).join(' ');
}

export function formatType(object) {
   if (!object) {
      return 'empty~object';
   } else {
      return Object.keys(object).join(' ');
   }
}
