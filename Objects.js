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

export function excludeKeys(object, regex) {
   let props = lodash.compact(Object.keys(object).filter(key => !regex.test(key))
   .map(key => createPropPair(key, object[key])));
   return Object.assign({}, ...props);
}

export function props(object) {
   return Object.keys(object).map(key => {
      let value = object[key];
      return {key, value};
   });
}

export function formatKeys(object) {
   if (object) {
      return Object.keys(object).join(' ');
   } else {
      return 'empty';
   }
}
