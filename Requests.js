// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import fs from 'fs';
import _request from 'request';
import lodash from 'lodash';

import Loggers from './Loggers';

const logger = Loggers.create(module.filename);

export function requestJson(options) {
   if (typeof options === 'string') {
      options = {url: options};
   }
   logger.debug('requestJson', options);
   assert(options.url, 'url');
   options.json = true;
   return request(options);
}

export function request(options) {
   logger.debug('request', options);
   if (lodash.isObject(options)) {
      if (options.lastModified) {
         options.headers = {'If-Modified-Since': options.lastModified};
      }
   }
   return new Promise((resolve, reject) => {
      _request(options, (err, response, content) => {
         logger.debug('response', options.url, err || response.statusCode);
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
   logger.debug('request', options);
   return new Promise((resolve, reject) => {
      _request(options, (err, response, content) => {
         logger.debug('response', options.url, err || response.statusCode);
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
   if (typeof options === 'string') {
      options = {url: options};
   }
   assert(options.url, 'url');
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
