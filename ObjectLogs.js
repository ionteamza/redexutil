// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function hhmm(date) {
   if (!date) {
      return 'empty~date';
   } else {
      return new Date(date).toISOString().substring(10, 14);
   }
}

export function sha(sha) {
   if (typeof sha !== 'string') {
      return typeof sha + '~sha'
   } else if (sha.length > 6) {
      return sha.slice(-6);
   } else {
      return 'sha~' + sha.length;
   }
}

export function format(object) {
   let string;
   if (!object) {
      return 'empty~object';
   } else if (typeof object === 'string') {
      string = object;
   } else if (lodash.isArray(object)) {
      return 'array~' + object.length;
   } else if (typeof object === 'object') {
      if (object.constructor) {
         return object.constructor.name + '~constructor';
      } else {
         logger.error('format', object);
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
      return [];
   }
   let result = {};
   if (!Object.keys(object).length) {
      return [];
   }
   Object.keys(object).forEach(key => {
      let value = object[key];
      if (!value) {
         value = 'empty';
      } else if (lodash.isObject(value)) {
         value = Object.keys(value).join(',');
      } else if (lodash.isArray(value)) {
         value = 'array~' + array.length;
      }
      result[key] = value;
   });
   return result;
}

export function formatKeys(object, predicate) {
   if (!object) {
      return 'empty~keys';
   } else if (predicate) {
      return Objects.keys(object, predicate).join(' ');
   } else {
      return Object.keys(object).join(' ');
   }
}

export function formatValues(object, predicate) {
   if (!object) {
      return 'empty~values';
   } else {
      return Objects.keys(object, predicate).map(key => {
         let value = object[key];
         logger.warn('formatValues', key, value);
         return key + ':' + format(value);
      }).join(' ');
   }
}

export function formatType(object) {
   if (!object) {
      return 'empty~type';
   } else {
      return Object.keys(object).join(' ');
   }
}
