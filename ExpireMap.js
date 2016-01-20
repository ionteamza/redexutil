
const logger = Loggers.create(__filename);

export default class ExpireMap {

   static isExpired(entry, time) {
      if (!entry) {
         logger.debug('isStale empty');
         return true;
      } else if (!entry.content) {
         logger.warn('isStale content', entry);
         return true;
      } else if (entry.expires === 0) {
         return false;
      } else if (!entry.expires) {
         logger.warn('isFresh expires', entry);
         return false;
      } else {
         return entry.expires > new Date().getTime();
      }
   }

   constructor(options) {
      this.map = new Map();
      this.errorKeys = new Set();
      this.defaultExpires = Arguments.coalesce(options.defaultExpires, Millis.fromSeconds(120));
      this.trimInterval = Arguments.coalesce(options.trimInterval, Millis.fromSeconds(180));
      logger.info('start', Millis.format(this.defaultExpires), Millis.format(this.trimInterval));
      this.trim();
      this.intervalId = setInterval(() => {
         try {
            this.trim();
         } catch (err) {
            logger.warn(err);
         }
      }, this.trimInterval);
   }

   end() {
      clearInterval(this.intervalId);
   }

   trim() {
      logger.info('trim', this.trimInterval, this.map.size);
   }

   set(key, content, expires) {
      assert(key, 'key');
      assert(content, 'content');
      if (expires === 0) {
      } else if (expires > 0) {
         assert(expires < Millis.fromHours(24), 'expires');
         expires += new Date().getTime();
      } else {
         expires = this.defaultExpires;
         logger.info('set expires', key, expires);
         expires += new Date().getTime();
      }
      this.map.set(key, {key, content, expires});
      this.errorKeys.delete(key);
      logger.debug('set', key, expires);
   }

   addErrorKey(key) {
      return this.errorKeys.add(key);
   }

   getEntry(key)  {
      return this.map.get(key);
   }

}
