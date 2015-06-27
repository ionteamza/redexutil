
import assert from 'assert';
import bunyan from 'bunyan';
import lodash from 'lodash';
import path from 'path';

const DefaultLevel = 'info';

const Levels = ['debug', 'info', 'warn', 'error'];
const ExtraLevels = ['state'];
const AllLevels = Levels.concat(ExtraLevels);

function createService() {

   const state = {
      limit: 10,
      logging: {
         info: [],
         debug: [],
         warn: [],
         error: [],
         state: []
      }
   };

   function logging(logger, name, loggerLevel, level, args) {
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
         if (lodash.includes(Levels, level)) {
            if (Levels.indexOf(level) >= Levels.indexOf(loggerLevel)) {
               logger[level].call(logger, ...args);
               //console.info('logging', name, loggerLevel, level, args);
            }
         }
      }
   }

   function decorate(logger, name, level) {
      return {
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
         }
      }
   }

   const service = {
      create(name, level) {
         name = path.basename(name, '.js');
         level = level || process.env.loggerLevel || DefaultLevel;
         if (lodash.includes(Levels, level)) {
            let logger = bunyan.createLogger({name, level});
            return decorate(logger, name, level);
         } else {
            assert(lodash.includes(ExtraLevels, level), 'level: ' + level);
            return decorate(null, name, level);
         }
      }
   };

   return service;
};

module.exports = createService();
