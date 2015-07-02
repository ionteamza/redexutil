// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redex/LICENSE

import fs from 'fs';
import yaml from 'js-yaml';

import Errors from './Errors';
import Files from './Files';
import Loggers from './Loggers';
import Maybe from './Maybe';

const logger = Loggers.create(module.filename);

const that = {
   readFileSyncMaybe(file) {
      logger.debug('readFileSyncMaybe', file);
      if (Files.existsFileSync(file)) {
         return Maybe.value(YamlFiles.readFileSync(file));
      }
      return Maybe.none(file);
   },
   readFileSyncDir(dir, file) {
      return that.readFileSync(Paths.join(dir, file));
   },
   readFile(file) {
      return Files.readFile(file).then(content => yaml.safeLoad(content));
   },
   readFileSync(file) {
      try {
         return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      } catch (e) {
         throw Errors.decorate(e);
      }
   }
};

module.exports = that;
