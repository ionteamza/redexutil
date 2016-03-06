// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import path from 'path';
import lodash from 'lodash';

import Loggers from './Loggers';

const logger = Loggers.create(__filename, 'info');

const mimeTypes = {
   md: 'text/x-markdown',
   html: 'text/html',
   txt: 'text/plain',
   json: 'application/json',
   js: 'text/javascript',
   css: 'text/css',
   ico: 'image/x-icon',
   jpeg: 'image/jpeg',
   jpg: 'image/jpeg',
   png: 'image/png',
   svg: 'image/svg+xml',
   otf: 'application/font-sfnt',
   ttf: 'application/font-sfnt',
   eot: 'application/vnd.ms-fontobject',
   woff: 'application/font-woff',
   woff2: 'font/font-woff2'
};

const defaultContentType = 'application/octet-stream';

module.exports = {
   defaultContentType: defaultContentType,
   getContentType(uri) {
      if (!lodash.isEmpty(uri)) {
         let ext = path.extname(uri);
         if (ext) {
            ext = ext.substring(1);
            ext = ext.toLowerCase();
            if (mimeTypes.hasOwnProperty(ext)) {
               return mimeTypes[ext];
            }
         }
      }
      return defaultContentType;
   },
   join(dir, file) {
      if (lodash.endsWith(dir, '/') && lodash.startsWith(file, '/')) {
         return dir + file.substring(1);
      } else if (lodash.endsWith(dir, '/') || lodash.startsWith(file, '/')) {
         return dir + file;
      } else {
         return dir + '/' + file;
      }
   },
   basename(file) {
      var matcher = file.match(/([^\/]+)\.[a-z]+$/);
      if (matcher) {
         return matcher[1];
      } else {
         return file;
      }
   }
};
