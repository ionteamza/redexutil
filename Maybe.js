// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// unused/experimental - for understanding Promises

import Loggers from './Loggers';

const logger = Loggers.create(module.filename);

const Maybe = {

   key(object, key, reason) {
      assert(object, 'object');
      assert(key, 'key');
      if (object.hasOwnProperty[key]) {
         return Maybe.resolve(object[key]);
      } else {
         if (!reason) {
            reason = 'no key: ' + key;
         }
         return Maybe.reject(reason);
      }
   },
   notEmpty(value, reason) {
      if (!lodash.isEmpty(value)) {
         return Maybe.resolve(value);
      } else {
         return Maybe.reject(reason || 'empty');
      }
   },
   isEmpty(value, reason) {
      if (lodash.isEmpty(value)) {
         return Maybe.resolve();
      } else {
         return Maybe.reject(reason || 'not empty');
      }
   },
   resolve(value) {
      return {
         get has() {
            return true;
         },
         get value() {
            return value;
         },
         then(resolve) {
            try {
               return Maybe.resolve(resolve(value));
            } catch (err) {
               if (err.stack) {
                  logger.warn('resolve', err.stack);
               }
               return Maybe.thrown(err);
            }
         },
         toString() {
            return `Maybe.resolve(${value})`;
         }
      };
   },
   reject(reason) {
      logger.warn('reject', reason);
      return {
         get has() {
            return false;
         },
         get value() {
            throw reason;
         },
         then(resolve, reject) {
            try {
               if (reject) {
                  reject(reason);
                  return Maybe.rejected(reason);
               } else {
                  logger.warn('reject', err);
                  return Maybe.thrown(reason);
               }
            } catch (err) {
               return Maybe.thrown(err, reason);
            }
         },
         toString() {
            return `Maybe.reject(${reason})`;
         }
      };
   },
   rejected(reason) {
      return {
         get has() {
            return false;
         },
         get value() {
            throw reason;
         },
         then(resolve, reject) {
            return Maybe.rejected(reason);
         },
         toString() {
            return `Maybe.reject(${reason})`;
         }
      };
   },
   thrown(error, reason) {
      return {
         get has() {
            return false;
         },
         get value() {
            throw error;
         },
         then(resolve, reject) {
            return Maybe.thrown(error, reason);
         },
         toString() {
            return `Maybe.thrown(${reason})`;
         }
      };
   }
};

module.exports = Maybe;
