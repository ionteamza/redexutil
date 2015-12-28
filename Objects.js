// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function values(object) {
   return Object.keys(object).map(key => object[key]);
}

function createPropPair(key, value) {
   let pair = {};
   pair[key] = value;
   return pair;
}

export function incr(object, key) {
   if (Numbers.isInteger(object[key])) {
      object[key] += 1;
   } else {
      object[key] = 1;
   }
   return object[key];
}

export function excludeKeys(object, regex) {
   let props = lodash.compact(Object.keys(object).filter(key => !regex.test(key))
   .map(key => createPropPair(key, object[key])));
   return Object.assign({}, ...props);
}

export function filter(value, predicate) {
   if (!predicate) {
   } else if (lodash.isFunction(predicate)) {
      return predicate(value);
   } else if (lodash.isArray(predicate)) {
      return lodash.includes(predicate, value);
   } else if (lodash.isObject(predicate)) {
      if (predicate.constructor) {
         if (predicate.constructor.name === 'RegExp') {
            if (value) {
               return predicate.test(value.toString());
            }
         }
      }
   } else {
   }
   return true;
}

export function keys(object, predicate) {
   return Object.keys(object).filter(key => filter(key, predicate));
}

export function extract(object, predicate) {
   let result = {};
   lodash.compact(Object.keys(object).forEach(key => {
      let value = object[key];
      if (filter(value, predicate)) {
         result[key] = value;
      }
   }));
   return result;
}

export function props(object, predicate) {
   return lodash.compact(Object.keys(object).map(key => {
      let value = object[key];
      if (filter(value, predicate)) {
         return {key, value};
      }
   }));
}

export function assignPairs(pairs, predicate) {
   const target = {};
   return lodash.compact(pairs.map(pair => {
      if (pair.value) {
         targe[pair.key] = pair.value;
      }
   }));
}

export function formatKeys(object) {
   logger.warn('formatKeys deprecated');
   return ObjectLogs.formatKeys(object);
}
