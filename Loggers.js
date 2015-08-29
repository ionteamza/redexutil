// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';
import bunyan from 'bunyan';
import lodash from 'lodash';

const DefaultLevel = 'info';
const Levels = ['debug', 'info', 'warn', 'error'];
const ExtraLevels = ['state', 'digest', 'child'];
const AllLevels = Levels.concat(ExtraLevels);

const state = {
   limit: 10,
   logging: {
      error: [],
      warn: [],
      info: [],
      debug: [],
      digest: []
   }
};

function basename(file) {
   var matcher = file.match(/([^\/]+)\.[a-z]+$/);
   if (matcher) {
      return matcher[1];
   } else {
      return file;
   }
};

module.exports = {
   pub() {
      return state.logging;
   },
   create(name, level) {
      name = basename(name);
      level = level || global.loggerLevel || process.env.loggerLevel || DefaultLevel;
      if (lodash.includes(Levels, level)) {
         let logger = bunyan.createLogger({name, level});
         return decorate(logger, name, level);
      } else {
         assert(lodash.includes(ExtraLevels, level), 'level: ' + level);
         return decorate(null, name, level);
      }
   }
};

function logging(logger, name, loggerLevel, context, level, args, count) {
   args = [].slice.call(args); // convert arguments to array
   if (!lodash.isEmpty(context)) {
      if (lodash.isArray(context)) {
         args = context.concat(args);
      }
   }
   if (!state.logging.hasOwnProperty(level)) {
      args.splice(0, 0, 'Invalid level: ' + level);
      level = 'warn';
   }
   if (logger) {
      if (level === 'digest') {
         if (count % 5 === 0) {
            logger.debug('digest', count, ...args);
         }
      } else if (lodash.includes(Levels, level)) {
         if (Levels.indexOf(level) >= Levels.indexOf(loggerLevel)) {
            logger[level].call(logger, ...args);
         }
      } else {

      }
   }
   args.splice(0, 0, name);
   state.logging[level].splice(0, 0, args);
   if (state.logging[level].length > state.limit) { // trim
      state.logging[level].length = state.limit;
   }
}

function decorate(logger, name, level) {
   let count = 0;
   let context = [];
   const those = {
      get name() {
         return name;
      },
      verbose() {
      },
      vdebug() {
      },
      debug() {
         if (level === 'debug') {
            logging(logger, name, level, context, 'debug', arguments);
         }
      },
      info() {
         if (level !== 'warn') {
            logging(logger, name, level, context, 'info', arguments);
         }
      },
      dev() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      dverbose() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      dinfo() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      warn() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      error() {
         logging(logger, name, level, context, 'error', arguments);
      },
      state() {
         logging(logger, name, level, context, 'state', arguments);
      },
      digest() {
         if (level === 'debug') {
            count += 1;
            logging(logger, name, level, context, 'digest', arguments, count);
         }
      },
      context() {
         context = [].slice.call(arguments);
      },
      child() {
         let childName = [name].concat([].slice.call(arguments)).join('.');
         return Loggers.create(childName, level);
      }
   };
   return those;
}
