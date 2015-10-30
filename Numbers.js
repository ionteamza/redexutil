
import * as Loggers from './Loggers';

const logger = Loggers.create(module.filename);

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
