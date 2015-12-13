// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function length(array, defaultValue) {
   if (!array) {
      return defaultValue;
   }
   return array.length;
}

export function reverse(array) {
   return lodash(array).slice(0).reverse().value();
}

export function pushIf(array, value, condition) {
   if (condition || value) {
      array.push(value);
   }
}

export async function mapAsync(array, fn) {
   return await* array.map(async (item) => {
      try {
         let result = await fn();
         logger.debug('mapAsync', result);
         return result;
      } catch (err) {
         logger.debug('mapAsync', err);
         throw err;
      }
   });
}
