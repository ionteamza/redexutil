// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// a more explicit promisification for redis client

// also see more automated attempt using es6-promisify:
// https://github.com/evanx/redex/blob/master/lib/redisPromisified.js

import redis from 'redis';

import Files from './Files';
import Loggers from './Loggers';

const logger = Loggers.create(module.filename, 'info');

const state = {
   count: 0,
   clients: new Set()
};

function selectPromise(client, dbNumber) {
   return new Promise((resolve, reject) => {
      client.select(dbNumber, err => {
         if (err) {
            logger.error('select', this.dbNumber);
            reject(err);
         } else {
            logger.info('select', this.dbNumber);
            resolve();
         }
      });
   });
}

function createClient(options) {
   state.count++;
   let redisClient = redis.createClient(options || {});
   state.clients.add(redisClient);
   redisClient.on('error', err => {
      logger.error('redis error:', err);
   });
   if (options.dbNumber) {
      selectPromise(redisClient, options.dbNumber);
   }
   return redisClient;
}

function createCallback(resolve, reject) {
   return (err, reply) => {
      if (err) {
         logger.debug('redis reject error:', err);
         reject(err);
      } else {
         logger.debug('redis resolve:', reply);
         resolve(reply);
      }
   };
}

function createPromise(fn) {
   return new Promise((resolve, reject) => fn(createCallback(resolve, reject)));
}

export default class Redis {

   // @param client
   // client maybe null e.g. if constructed with empty options object i.e. {}
   // if no options, then client is created

   constructor(options) {
      if (options) {
         if (lodash.isString(options)) {
            this.source = Files.basename(options);
            this.client = createClient(options);
            logger.info('construct', state.count, this.source);
         } else if (options === {}) {
            logger.info('construct defer');
         } else if (options.client) {
            this.client = options.client;
            logger.info('construct wrapper');
         } else if (options.source) {
            this.source = Files.basename(options.source);
            this.client = createClient(options);
            logger.info('construct', state.count, this.source);
         } else if (options.return_buffers || options.dbNumber) {
            this.client = createClient(options);
         } else {
            throw 'Invalid options: ' + options.toString();
         }
      } else {
         this.client = createClient();
         logger.info('construct', state.count);
      }
      if (this.client && this.dbNumber) {
         selectPromise(this.client, this.dbNumber);
      }
   }

   init(options) {
      if (!this.client) {
         this.client = createClient(options);
      }
      if (options && options.dbNumber) {
         selectPromise(this.client, options.dbNumber);
      } else if (this.dbNumber) {
         selectPromise(this.client, this.dbNumber);
      }
   }

   select(dbNumber) {
      return createPromise(cb => this.client.select(dbNumber, cb));
   }

   end() {
      if (this.client) {
         if (state.clients.size > 0) {
            state.clients.delete(this.client);
            logger.info('end', state.clients.size, this.source);
         } else {
            logger.error('end');
         }
         this.client.end();
         this.client = null;
      }
   }

   time() {
      return createPromise(cb => this.client.time(cb));
   }

   timeSeconds() {
      return this.time().then(time => {
         return parseInt(time[0]);
      });
   }

   set(key, value) {
      //logger.debug('set', key, value);
      return createPromise(cb => this.client.set(key, value, cb));
   }

   get(key) {
      return createPromise(cb => this.client.get(key, cb));
   }

   mget(keys) {
      return createPromise(cb => this.client.mget(keys, cb));
   }

   del(key) {
      return createPromise(cb => this.client.del(key, cb));
   }

   expire(key, seconds) {
      return createPromise(cb => this.client.expire(key, seconds, cb));
   }

   sadd(key, member) {
      //logger.debug('sadd', key, member);
      return createPromise(cb => this.client.sadd(key, member, cb));
   }

   sismember(key, member) {
      return createPromise(cb => this.client.sismember(key, member, cb));
   }

   smembers(key, member) {
      return createPromise(cb => this.client.smembers(key, cb));
   }

   srem(key, member) {
      return createPromise(cb => this.client.srem(key, member, cb));
   }

   scard(key) {
      return createPromise(cb => this.client.scard(key, cb));
   }

   hset(key, field, value) {
      return createPromise(cb => this.client.hset(key, field, value, cb));
   }

   hmset(key, value) {
      return createPromise(cb => this.client.hmset(key, value, cb));
   }

   hget(key, field) {
      return createPromise(cb => this.client.hget(key, field, cb));
   }

   hgetall(key) {
      return createPromise(cb => this.client.hgetall(key, cb));
   }

   lindex(key, index) {
      return createPromise(cb => this.client.lindex(key, index, cb));
   }

   lset(key, index, value) {
      return createPromise(cb => this.client.lset(key, index, value, cb));
   }

   llen(key) {
      return createPromise(cb => this.client.llen(key, cb));
   }

   ltrim(key, start, stop) {
      return createPromise(cb => this.client.ltrim(key, start, stop, cb));
   }

   lrange(key, start, stop) {
      return createPromise(cb => this.client.lrange(key, start, stop, cb));
   }

   lpush(key, value) {
      return createPromise(cb => this.client.lpush(key, value, cb));
   }

   rpush(key, value) {
      return createPromise(cb => this.client.rpush(key, value, cb));
   }

   lpop(key) {
      return createPromise(cb => this.client.lpop(key, cb));
   }

   rpop(key) {
      return createPromise(cb => this.client.rpop(key, cb));
   }

   blpop(key, timeout) {
      return createPromise(cb => this.client.blpop(key, timeout, cb));
   }

   brpop(key, timeout) {
      return createPromise(cb => this.client.brpop(key, timeout, cb));
   }

   rpoplpush(source, destination) {
      return createPromise(cb => this.client.rpoplpush(source, destination, cb));
   }

   brpoplpush(source, destination, timeout) {
      return createPromise(cb => this.client.brpoplpush(source, destination, timeout, cb));
   }

   zrange(key, start, stop) {
      return createPromise(cb => this.client.zrange(key, start, stop, cb));
   }

   zrevrange(key, start, stop) {
      return createPromise(cb => this.client.zrevrange(key, start, stop, cb));
   }

   // TODO all the rest, see https://github.com/mranney/node_redis/blob/master/lib/commands.js

   multi() {
      let multi = this.client.multi();
      multi.execCallback = multi.exec;
      multi.execPromise = () => {
         return createPromise(cb => multi.execCallback(cb));
      };
      multi.exec = multi.execPromise;
      return multi;
   }

}

// see test: https://github.com/evanx/redex/blob/master/test/redisPromised.js
