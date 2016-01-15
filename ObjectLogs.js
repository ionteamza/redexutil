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
   } else if (lodash.isArray(object)) {
      return object.length + '~array';
   } else if (typeof object === 'object') {
      if (object.constructor) {
         return object.constructor.name + '~object';
      } else {
         logger.error('formatString', object);
         return object.toString();
      }
   } else {
      string = object.toString();
   }
   if (/\s/.test(string)) {
      return 'string~' + string.length;
   } else {
      return string;
   }
}

export function valueProps(object) {
   if (!object) {
      return 'empty';
   }
   let result = {};
   if (!Object.keys(object).length) {
      return 'empty~props';
   }
   Object.keys(object).forEach(key => {
      let value = object[key];
      if (!value) {
         value = 'empty';
      } else if (lodash.isObject(value)) {
         value = 'object:' + Object.keys(value).join(',');
      } else if (lodash.isArray(value)) {
         value = 'array:' + array.length;
      }
      result[key] = value;
   });
   return result;
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
         return key + '#s' + formatString(value);
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
