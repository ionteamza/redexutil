// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import fs from 'fs';
import requestf from 'request';
import lodash from 'lodash';

import Loggers from './Loggers';

const logger = Loggers.create(__filename);

export function requestJson(options) {
   options = processOptions(options);
   options.json = true;
   logger.debug('requestJson', options);
   return request(options);
}

export function request(options) {
   options = processOptions(options);
   logger.debug('request', options);
   return new Promise((resolve, reject) => {
      requestf(options, (err, response, content) => {
         logger.debug('response', options.url || options, err || response.statusCode);
         if (err) {
            reject(err);
         } else if (response.statusCode !== 200) {
            reject({statusCode: response.statusCode});
         } else {
            resolve(content);
         }
      });
   });
}

export function response(options) {
   options = processOptions(options);
   logger.debug('request', options);
   return new Promise((resolve, reject) => {
      requestf(options, (err, response, content) => {
         logger.debug('response', options, err || response.statusCode);
         if (err) {
            reject(err);
         } else if (response.statusCode === 200) {
            resolve([response, content]);
         } else {
            resolve([response]);
         }
      });
   });
}

export function head(options) {
   options = processOptions(options);
   options.method = 'HEAD';
   logger.debug('head', options);
   return new Promise((resolve, reject) => {
      request(options, (err, response) => {
         logger.debug('response', options.url, err || response.statusCode);
         if (err) {
            reject(err);
         } else {
            resolve(response);
         }
      });
   });
}

function processOptions(options) {
   if (typeof options === 'string') {
      return {url: options};
   } else if (typeof options === 'object') {
      assert(options.url, 'url');
      if (options.lastModified) {
         options.headers = {'If-Modified-Since': options.lastModified};
      }
      return options;
   } else {
      throw 'Invalid request options type: ' + (typeof options);
   }
}
