// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

const Errors = {
   decorate(error, decoration) {
      if (decoration) {
         if (error.name === 'YAMLException') {
            let err = Object.assign(decoration, {reason: error.reason});
            if (error.mark) {
               Object.keys(error.mark).filter(
                  name => name !== 'buffer'
               ).forEach(name => {
                  err[name] = error.mark[name];
               });
            }
            err.name = 'AbbreviatedYAMLException';
            return err;
         } else {
         }
      } else {
      }
      return error;
   }
};

module.exports = Errors;
