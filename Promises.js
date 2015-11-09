// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

function createCallback(resolve, reject) {
   return (err, reply) => {
      if (err) {
         reject(err);
      } else {
         resolve(reply);
      }
   };
}

class Promises {

   create(fn) {
      return new Promise((resolve, reject) => fn(createCallback(resolve, reject)));
   }

   delay(millis) {
      return new Promise((resolve, reject) => {
         setTimeout(() => resolve(), millis);
      });
   }

   timeout(reason, timeout, promise) {
      if (timeout) {
         return new Promise((resolve, reject) => {
            logger.warn('timeout', typeof promise);
            promise.then(resolve, reject);
            setTimeout(() => {
               reject(reason + ' (' + timeout + 'ms)');
            }, timeout);
         });
      } else {
         return promise;
      }
   }

   map(values, fn) {
      return Promise.all(values.map(fn));
   }

   staggered(maxDelay, totalPeriod, values, fn) {
      if (lodash.isEmpty(values)) {
         return Promise.resolve([]);
      }
      let delay = Math.floor(totalPeriod/values.length);
      logger.debug('staggered', maxDelay, delay, values.length);
      return Promise.all(values.map(async (value, index) => {
         await this.delay(Math.min(maxDelay, delay));
         return fn(value);
      }));
   }

   series(values, fn) {
      if (lodash.isEmpty(values)) {
         return Promise.resolve([]);
      }
      values = values.slice(0);
      return new Promise((resolve, reject) => {
         let results = [];
         function next(result) {
            logger.debug('series next', result, results.length, values.length);
            results.push(result);
            if (lodash.isEmpty(values)) {
               resolve(results);
            }
            fn(values.shift()).then(next).catch(reject);
         }
         logger.debug('series start', values.length);
         return fn(values.shift()).then(next).catch(reject);
      });
   }

   notEmpty(value, reason) {
      if (!lodash.isEmpty(value)) {
         return Promise.resolve(value);
      } else {
         return Promise.reject(reason);
      }
   }

   isEmpty(value, reason) {
      if (lodash.isEmpty(value)) {
         return Promise.resolve(value);
      } else {
         return Promise.reject(reason);
      }
   }
};

module.exports = new Promises();
