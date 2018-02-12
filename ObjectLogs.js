// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function join(array) {
   if (!lodash.isArray(array)) {
      return 'InvalidArray';
   } else if (lodash.isEmpty(array)) {
      return 'EmptyArray';
   } else {
      return array.join(' ');
   }
}

export function keys(object) {
   if (!object) {
      return 'EmptyObject';
   } else {
      const keys = Object.keys(object);
      if (lodash.isEmpty(keys)) {
         return 'EmptyKeys';
      } else {
         return keys.join(' ');
      }
   }
}

export function hhmm(date) {
   if (!date) {
      return 'EmptyDate';
   } else {
      return new Date(date).toISOString().substring(10, 14);
   }
}

export function sha(sha) {
   if (typeof sha !== 'string') {
      return 'Sha:InvalidType:' + typeof sha;
   } else if (sha.length > 6) {
      return sha.slice(-6);
   } else {
      return 'Sha:' + sha.length;
   }
}

export function format(object) {
   let string;
   if (!object) {
      return 'EmptyObject';
   } else if (typeof object === 'string') {
      string = object;
   } else if (lodash.isArray(object)) {
      return 'Array:' + object.length;
   } else if (typeof object === 'object') {
      if (object.constructor) {
         return 'Object:' + object.constructor.name;
      } else {
         logger.error('format', object);
         return object.toString();
      }
   } else {
      string = object.toString();
   }
   if (/\s/.test(string)) {
      return 'String:' + string.length;
   } else {
      return string;
   }
}

export function valueProps(object) {
   if (!object) {
      return [];
   }
   let result = {};
   if (!Object.keys(object).length) {
      return [];
   }
   Object.keys(object).forEach(key => {
      let value = object[key];
      if (!value) {
         value = 'EmptyValue';
      } else if (lodash.isObject(value)) {
         value = Object.keys(value).join(',');
      } else if (lodash.isArray(value)) {
         value = 'Array:' + array.length;
      }
      result[key] = value;
   });
   return result;
}

export function formatKeys(object, predicate) {
   if (!object) {
      return 'EmptyKeys';
   } else if (predicate) {
   } else if (lodash.isFunction(predicate)) {
      return Objects.keys(object, predicate).join(' ');
   } else {
      return Object.keys(object).join(' ');
   }
}

export function formatValues(object, predicate) {
   if (!object) {
      return 'EmptyObject';
   }
   let keys = [];
   if (!predicate) {
      keys = Object.keys(object);
   } else if (lodash.isFunction(predicate)) {
   } else if (lodash.isString(predicate)) {
      keys = predicate.split(' ');
   } else if (lodash.isArray(predicate)) {
   } else {
      return 'InvalidPredicate:' + typeof predicate;
   }
   if (keys.length) {
      predicate = key => keys.includes(key);
   }
   return Objects.keys(object, predicate).map(key => {
      const value = object[key];
      const string = format(value);
      if (string.indexOf(' ') >= 0) {
         return `${key}='${string}'`;
      } else {
         return key + '=' + value;
      }
   }).join(' ');
}

export function formatType(object) {
   if (!object) {
      return 'EmptyType';
   } else {
      return Object.keys(object).join(' ');
   }
}
