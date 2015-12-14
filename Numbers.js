// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function parseInt(value, defaultValue) {
   if (value) {
      try {
         return global.parseInt(value);
      } catch (err) {
         logger.debug('parseInt', value, defaultValue);
      }
   }
   return defaultValue;
}

export function isInteger(value) {
   return value && !isNaN(value) && /^[0-9]+$/.test(value.toString());
}

