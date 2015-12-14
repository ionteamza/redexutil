// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import fs from 'fs';
import _mkdirp from 'mkdirp';

import Promises from './Promises';
import Loggers from './Loggers';

const logger = Loggers.create(__filename, 'info');

const Files = {
   mkdirp(dir) {
      return Promises.create(cb => _mkdirp(dir, cb));
   },
   remove(file) {
      return Promises.create(cb => fs.unlink(file, cb));
   },
   basename(file) {
      var matcher = file.match(/([^\/]+)\.[a-z]+$/);
      if (matcher) {
         return matcher[1];
      } else {
         return file;
      }
   },
   stat(file) {
      logger.debug('stat', file);
      return Promises.create(cb => fs.stat(file, cb));
   },
   existsFile(file) {
      return Files.stat(file).then(stats => stats.isFile()).catch(err => {
         logger.debug('existsFile', err.message);
         return false;
      });
   },
   existsFileSync(file) {
      try {
         return fs.statSync(file).isFile();
      } catch (err) {
         logger.debug('existsFileSync', err.message);
         return false;
      }
   },
   watchChanged(dir, timeout) {
      return new Promise((resolve, reject) => {
         let watcher = fs.watch(dir, (eventType, file) => {
            watcher.close();
            logger.debug('watch', dir, eventType, file);
            if (eventType === 'change') {
               resolve(file);
            } else {
               reject(eventType);
            }
         });
         setTimeout(() => {
            watcher.close();
            logger.debug('watch timeout', dir, timeout);
            reject('timeout: ' + timeout);
         }, timeout);
      });
   },
   readFile(file) {
      logger.debug('readFile', file);
      return new Promise((resolve, reject) => {
         fs.readFile(file, (err, content) => {
            logger.debug('readFile', file, {err});
            if (err) {
               reject(err);
            } else {
               logger.debug('readFile resolve:', file, content.length);
               resolve(content);
            }
         });
      });
   },
   readFileString(file) {
      return Files.readFile(file).then(content => content.toString());
   },
   writeFile(file, content) {
      logger.debug('writeFile', file);
      return new Promise((resolve, reject) => {
         fs.writeFile(file, content, err => {
            logger.debug('writeFile', file, {err});
            if (err) {
               reject(err);
            } else {
               resolve();
            }
         });
      });
   }
};

module.exports = Files;
