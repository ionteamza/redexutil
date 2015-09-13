// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

export function reverse(array) {
   return lodash(array).slice(0).reverse().value();
}

export async function mapAsync(array, fn) {
   return await* array.map(async (item) => {
      try {
         let result = await fn();
         logger.info('mapAsync', result);
         return result;
      } catch (err) {
         logger.warn('mapAsync', err);
         throw err;
      }
   });
}
