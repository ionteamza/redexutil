
// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redex/LICENSE

import lodash from 'lodash';

import Loggers from './Loggers';

const logger = Loggers.create(module.filename);

function formatTimeoutErrorMessage(name, timeoutMillis) {
   return name + ' (' + timeout + 'ms)';
}

function createCallback(resolve, reject) {
   return (err, reply) => {
      if (err) {
         reject(err);
      } else {
         resolve(reply);
      }
   };
}

module.exports = {
   create(fn) {
      return new Promise((resolve, reject) => fn(createCallback(resolve, reject)));
   },
   delay(millis) {
      return new Promise((resolve, reject) => {
         setTimeout(() => resolve(), millis);
      });
   },
   timeout(name, timeout, promise) {
      if (timeout) {
         return new Promise((resolve, reject) => {
            console.warn('timeout', typeof promise);
            promise.then(resolve, reject);
            setTimeout(() => {
               let message = formatTimeoutErrorMessage(name, timeout);
               reject({name, message});
            }, timeout);
         });
      } else {
         return promise;
      }
   }
};
