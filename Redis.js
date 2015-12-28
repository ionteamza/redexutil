// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// A more explicit promisification for redis client.
// Also see more automated attempt using es6-promisify:
// https://github.com/evanx/redex/blob/master/lib/redisPromisified.js

import lodash from 'lodash';
import redis from 'redis';

import Paths from './Paths';
import Loggers from './Loggers';

const logger = Loggers.create(__filename, 'info');

const state = {
   count: 0,
   clients: new Set(),
   globalDefaultOptions: {},
   globalOverrideOptions: {}
};

function createClient(options) {
   let redisClient;
   state.count++;
   options = Object.assign({}, state.globalDefaultOptions, options || {}, state.globalOverrideOptions);
   if (options.url) {
      let match = options.url.match(/^redis:\/\/([^:]+):([0-9]+)$/);
      if (match) {
         options.host = match[1];
         options.port = parseInt(match[2]);
         redisClient = redis.createClient(options.port, options.host);
      }
   }
   if (!redisClient) {
      redisClient = redis.createClient(options);
   }
   logger.info('createClient', state.count, options);
   redisClient.on('error', err => {
      logger.error('redis', err);
   });
   state.clients.add(redisClient);
   if (options.select) {
      redisClient.select(options.select);
   }
   return redisClient;
}

function createCallback(resolve, reject) {
   return (err, reply) => {
      if (err) {
         logger.warn('redis reject error', err);
         reject(err);
      } else {
         logger.debug('redis resolve', reply);
         resolve(reply);
      }
   };
}

function createPromise(fn) {
   return new Promise((resolve, reject) => fn(createCallback(resolve, reject)));
}

export default class Redis {

   static async start(initialState) {
      Object.assign(state, initialState);
   }

   // @param client
   // client maybe null e.g. if constructed with empty options object i.e. {}
   // if no options, then client is created

   constructor(options) {
      logger.info('Redis constructor', options);
      if (options) {
         if (lodash.isString(options)) {
            this.source = Paths.basename(options);
            this.client = createClient();
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
         } else if (options.return_buffers || options.dbNumber || options.url) {
            this.client = createClient(options);
         } else {
            throw 'Invalid Redis options: ' + JSON.stringify(options);
         }
      } else {
         this.client = createClient();
         logger.info('construct', state.count);
      }
      if (this.client) {
         this.init(options);
      }
   }

   init(options) {
      if (!this.client) {
         this.client = createClient(options);
      }
      if (global.redisNumber) { // use alternative database for all connections
         this.select(global.redisNumber);
      } else if (options && options.dbNumber) {
         this.select(options.dbNumber);
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

   del(key) {
      return createPromise(cb => this.client.del(key, cb));
   }

   dump(key) {
      return createPromise(cb => this.client.dump(key, cb));
   }

   get(key) {
      return createPromise(cb => this.client.get(key, cb));
   }

   exists(key) {
      return createPromise(cb => this.client.exists(key, cb));
   }

   expire(key, seconds) {
      return createPromise(cb => this.client.expire(key, seconds, cb));
   }

   keys(match) {
      return createPromise(cb => this.client.keys(match, cb));
   }

   mget(keys) {
      //logger.info('mget', lodash.isArray(keys), keys);
      return createPromise(cb => this.client.mget(keys, cb));
   }

   restore(key, ttl, value) {
      return createPromise(cb => this.client.restore(key, ttl, value, cb));
   }

   scan(cursor, match, count) {
      return createPromise(cb => this.client.scan(cursor, 'match', match, 'count', count, cb));
   }

   set(key, value) {
      return createPromise(cb => this.client.set(key, value, cb));
   }

   setex(key, seconds, value) {
      return createPromise(cb => this.client.setex(key, seconds, value, cb));
   }

   setnx(key, value) {
      return createPromise(cb => this.client.setnx(key, value, cb));
   }

   sadd(key, member) {
      return createPromise(cb => this.client.sadd(key, member, cb));
   }

   sismember(key, member) {
      return createPromise(cb => this.client.sismember(key, member, cb));
   }

   sinter(key, members) {
      return createPromise(cb => this.client.sinter(key, members, cb));
   }

   smembers(key) {
      return createPromise(cb => this.client.smembers(key, cb));
   }

   srem(key, member) {
      return createPromise(cb => this.client.srem(key, member, cb));
   }

   scard(key) {
      return createPromise(cb => this.client.scard(key, cb));
   }

   ttl(key) {
      return createPromise(cb => this.client.ttl(key, cb));
   }

   hdel(key, ...fields) {
      return createPromise(cb => this.client.hdel(key, fields, cb));
   }

   hget(key, field) {
      return createPromise(cb => this.client.hget(key, field, cb));
   }

   hmget(key, fields) {
      return createPromise(cb => this.client.hmget(key, fields, cb));
   }

   hgetall(key) {
      return createPromise(cb => this.client.hgetall(key, cb));
   }

   hkeys(key) {
      return createPromise(cb => this.client.hkeys(key, cb));
   }

   hmset(key, value) {
      return createPromise(cb => this.client.hmset(key, value, cb));
   }

   hset(key, field, value) {
      return createPromise(cb => this.client.hset(key, field, value, cb));
   }

   hsetnx(key, field, value) {
      return createPromise(cb => this.client.hsetnx(key, field, value, cb));
   }

   lindex(key, index) {
      return createPromise(cb => this.client.lindex(key, index, cb));
   }

   linsert(key, position, pivot, value) {
      return createPromise(cb => this.client.linsert(key, position, pivot, value, cb));
   }

   lrem(key, count, value) {
      return createPromise(cb => this.client.lrem(key, count, value, cb));
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

   zadd(key, score, member) {
      //logger.tdebug('zadd', key, score, member);
      return createPromise(cb => this.client.zadd(key, score, member, cb));
   }

   zcard(key) {
      return createPromise(cb => this.client.zcard(key, cb));
   }

   zrange(key, start, stop) {
      return createPromise(cb => this.client.zrange(key, start, stop, cb));
   }

   zrem(key, member) {
      return createPromise(cb => this.client.zrem(key, member, cb));
   }

   zrevrange(key, start, stop) {
      return createPromise(cb => this.client.zrevrange(key, start, stop, cb));
   }

   // TODO all the rest, see https://github.com/mranney/node_redis/blob/master/lib/commands.js

   multi() {
      let multi = this.client.multi();
      multi.execCallback = multi.exec.bind(multi); // TODO
      multi.exec = function() {
         return createPromise(cb => multi.execCallback(cb));
      };
      return multi;
   }
}

// see test: https://github.com/evanx/redex/blob/master/test/redisPromised.js
