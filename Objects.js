// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';

import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

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
