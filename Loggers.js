
import assert from 'assert';
import bunyan from 'bunyan';
import lodash from 'lodash';
import path from 'path';

const DefaultLevel = 'info';

const Levels = ['debug', 'info', 'warn', 'error'];
const ExtraLevels = ['state', 'digest'];
const AllLevels = Levels.concat(ExtraLevels);

function createService() {

   const state = {
      limit: 10,
      logging: {
         info: [],
         debug: [],
         warn: [],
         error: [],
         digest: [],
         state: []
      }
   };

   const Loggers = {
      create(name, level) {
         name = path.basename(name, '.js');
         level = level || global.loggerLevel || process.env.loggerLevel || DefaultLevel;
         if (lodash.includes(Levels, level)) {
            let logger = bunyan.createLogger({name, level});
            //logger.info('logger', level, global.loggerLevel);
            return decorate(logger, name, level);
         } else {
            assert(lodash.includes(ExtraLevels, level), 'level: ' + level);
            return decorate(null, name, level);
         }
      }
   };

   function logging(logger, name, loggerLevel, level, args, count) {
      args = [].slice.call(args); // convert arguments to array
      if (!state.logging.hasOwnProperty(level)) {
         args.splice(0, 0, 'Invalid level: ' + level);
         level = 'warn';
      }
      state.logging[level].splice(0, 0, args);
      if (state.logging[level].length > state.limit) { // trim
         state.logging[level].length = state.limit;
      }
      if (logger) {
         if (level === 'digest') {
            if (count % 5 === 0) {
               logger.info('digest', count, ...args);
            }
         } else if (lodash.includes(Levels, level)) {
            if (Levels.indexOf(level) >= Levels.indexOf(loggerLevel)) {
               logger[level].call(logger, ...args);
               //console.info('logging', name, loggerLevel, level, args);
            }
         }
      }
   }

   function decorate(logger, name, level) {
      let count = 0;
      const logr = {
         get name() {
            return name;
         },
         debug() {
            if (level === 'debug') {
               logging(logger, name, level, 'debug', arguments);
            }
         },
         info() {
            logging(logger, name, level, 'info', arguments);
         },
         warn() {
            logging(logger, name, level, 'warn', arguments);
         },
         error() {
            logging(logger, name, level, 'error', arguments);
         },
         state() {
            logging(logger, name, level, 'state', arguments);
         },
         digest() {
            count += 1;
            logging(logger, name, level, 'digest', arguments, count);
         },
         method(methodName, param) {
            return Loggers.create(name + '.' + methodName + '(' + param + ')', level);
         }
      };
      return logr;
   }

   return Loggers;
};

module.exports = createService();
