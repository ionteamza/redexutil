// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';
import bunyan from 'bunyan';
import lodash from 'lodash';

const defaultLevel = 'info';
const levels = ['debug', 'info', 'warn', 'error'];
const extraLevels = ['state', 'digest', 'child'];
const allLevels = levels.concat(extraLevels);
const digestLimit = 100;
const state = {
   limit: 10,
   counters: {},
   logging: {
      error: [],
      warn: [],
      info: [],
      debug: [],
      digest: []
   }
};

function increment(name, prop) {
   prop = name + '.' + prop;
   if (!state.counters[prop]) {
      state.counters[prop] = 0;
   }
   state.counters[prop] += 1;
}

function basename(file) {
   var matcher = file.match(/([^\/]+)\.[a-z]+$/);
   if (matcher) {
      return matcher[1];
   } else {
      return file;
   }
}

module.exports = {
   pub() {
      return Object.assign({}, {counters: state.counters}, state.logging);
   },
   counters() {
      return state.counters;
   },
   create(name, level) {
      name = basename(name);
      level = level || global.loggerLevel || process.env.loggerLevel || defaultLevel;
      if (lodash.includes(levels, level)) {
         let logger = bunyan.createLogger({name, level});
         return decorate(logger, name, level);
      } else {
         assert(lodash.includes(extraLevels, level), 'level: ' + level);
         return decorate(null, name, level);
      }
   }
};

function logging(logger, name, loggerLevel, context, level, args, count) {
   increment(name, level);
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
         if (count < digestLimit/10 && count % digestLimit === 0) {
            logger.info('digest', count, ...args);
         }
      } else if (lodash.includes(levels, level)) {
         if (levels.indexOf(level) >= levels.indexOf(loggerLevel)) {
            logger[level].call(logger, ...args);
            let error = findArgsError(args);
            if (error) {
               if (error.code && error.code === 'ETIMEOUT') {
               } else {
                  logger[level].call(logger, error);
               }
            }
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

function findArgsError(args) {
   if (lodash.isError(args[0])) {
      return args[0];
   } else if (lodash.isError(args[1])) {
      return args[1];
   } else if (lodash.isError(args[args.length - 1])) {
      return args[args.length - 1];
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
      wverbose() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      wdebug() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      winfo() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      dverbose() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      ddebug() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      dinfo() {
         logging(logger, name, level, context, 'warn', arguments);
      },
      tdebug() {
         if (process.env.envType === 'test') {
            logging(logger, name, level, context, 'info', arguments);
         }
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
      },
      increment(prop) {
         increment(name, prop);
      }
   };
   return those;
}
