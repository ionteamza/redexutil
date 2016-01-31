// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import assert from 'assert';
import bunyan from 'bunyan';
import lodash from 'lodash';

import Redis from './Redis';

const defaultLevel = 'info';
const levels = ['debug', 'info', 'warn', 'error'];
const digestLimit = 100;
let redis;

const state = {
   limit: 10,
   stats: {},
   logging: {
      error: [],
      warn: [],
      info: [],
      debug: [],
      digest: []
   }
};

export function publish() {
   return Object.assign({}, state.stats, state.logging);
}

export function create(name, level) {
   return new RedisLogger(name, level);
}

export async function start(options) {
   assert(options.redis, 'options.redis');
   assert(options.redis, 'options.redis');
   redis = new Redis(options.redis);
   }
}

export function end() {
   redis.end();
}

class RedisLogger {

   constructor(name, level) {
      this.name = basename(name);
      this.level = level || global.loggerLevel || process.env.loggerLevel || defaultLevel;
      this.logger = bunyan.createLogger({this.name, this.level});
      this.count = 0;
      this.time = 0;
   }

   get name() {
      return this.name;
   }

   context() {
      this.context = [].slice.call(arguments);
   }

   digest() {
      if (level === 'debug') {
         this.count += 1;
         if (this.count < digestLimit/10 && this.count % digestLimit === 0) {
            this.log('debug', arguments, 'digest:' + this.count);
         }
      }
   }

   start() {
      if (level === 'debug') {
         this.time = new Date().getTime();
         this.log('debug', ['start', ...arguments]);
      }
   }

   end() {
      if (level === 'debug') {
         let duration = 0;
         let logLevel = 'debug';
         if (!this.time) {
            logLevel = 'warn';
         } else {
            duration = new Date().getTime() - this.time;
            if (duration > 8000) {
               logLevel = 'warn';
            }
         }
         let meta = 'completed:' + duration + 'ms';
         this.log(logLevel, [meta, ...arguments]);
         return duration;
      }
   }

   increment(prop) {
      if (level === 'debug') {
         this.log('debug', ['increment', ...arguments]);
      }
      return increment(this.logger, this.name, prop);
   }

   peak(prop, value) {
      return peak(this.logger, this.name, prop, value);
   }

   timer(prop, time) {
      return peak(this.logger, this.name, prop, new Date().getTime() - time);
   }

   debug() {
      if (level === 'debug') {
         this.log('debug', arguments);
      }
   }

   info() {
      if (level !== 'warn') {
         this.log('info', arguments);
      }
   }

   verbose() {
   }

   vdebug() {
   }

   dev() {
      this.log('warn', arguments);
   }

   warn() {
      this.log('warn', arguments);
   }

   error() {
      this.log('error', arguments);
   }

   wverbose() {
      this.log('warn', arguments);
   }

   wdebug() {
      this.log('warn', arguments);
   }

   winfo() {
      this.log('warn', arguments);
   }

   dverbose() {
      this.log('warn', arguments);
   }

   ddebug() {
      this.log('warn', arguments);
   }

   tdebug() {
      if (process.env.envType === 'test') {
         this.log('info', arguments);
      }
   }

   log(level, args) {
      increment(this.logger, this.name, level);
      args = [].slice.call(args); // convert arguments to array
      if (!lodash.isEmpty(this.context)) {
         if (lodash.isArray(this.context)) {
            args = this.context.concat(args);
         }
      }
      if (!state.logging.hasOwnProperty(level)) {
         args.splice(0, 0, 'Invalid level: ' + level);
         level = 'warn';
      }
      if (this.logger) {
         if (lodash.includes(levels, level)) {
            if (levels.indexOf(level) >= levels.indexOf(this.level)) {
               this.logger[level].call(this.logger, ...args);
               let error = findArgsError(args);
               if (error) {
                  if (error.code && error.code === 'ETIMEOUT') {
                  } else {
                     this.logger[level].call(this.logger, error);
                  }
               }
            }
         }
      }
      let date = new Date().toISOString().substring(0, 16);
      let message = [date, this.name, ...args];
      state.logging[level].splice(0, 0, message);
      if (state.logging[level].length > state.limit) { // trim
         state.logging[level].length = state.limit;
      }
   }
}

function findArgsError(args) {
   if (isError(args[1])) { // underlying logger handles error in first arg
      return args[1];
   } else if (isError(args[args.length - 1])) {
      return args[args.length - 1];
   }
}

function isError(value) {
   if (value && value.constructor && /Error/.test(value.constructor.name) && value.stack) {
      return true;
   } else {
      return lodash.isError(value);
   }
}

function getStats(name) {
   let stats = state.stats[name];
   if (!stats) {
      stats = {
         counts: {},
         averages: {},
         peaks: {},
      };
      state.stats[name] = stats;
   }
   return stats;
}

function increment(logger, name, prop) {
   let stats = getStats(name);
   let count = stats.counts[prop] || 0;
   count += 1;
   stats.counts[prop] = count;
   return count;
}

function peak(logger, name, prop, value) {
   let stats = getStats(name);
   let count = stats.counts[prop] || 0;
   count += 1;
   stats.counts[prop] = count;
   //
   let average = stats.averages[prop];
   if (!average) {
      average = value;
   } else if (count > 1) {
      average = ((count - 1) * average + value)/count;
   }
   stats.averages[prop] = average;
   //
   let peak = stats.peaks[prop];
   if (!stats.peaks.hasOwnProperty(prop)) {
      stats.peaks[prop] = value;
      return value;
   }
   if (value > peak) {
      stats.peaks[prop] = value;
      peak = value;
      logger.info('peak', prop, value, count, average);
   }
   return peak;
}

function basename(file) {
   var matcher = file.match(/([^\/]+)\.[a-z]+$/);
   if (matcher) {
      return matcher[1];
   } else {
      return file;
   }
}
