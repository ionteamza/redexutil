// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import Sample from './Sample';

export default class Stats {

   constructor(logger, options) {
      this.hour = new Sample('hour');
      this.minute = new Sample('minute');
      this.day = new Sample('day');
      this.session = new Sample('session');
      this.startTime = new Date().getTime();
      this.options = {
         slowLimit: 200
      };
      this.logger = logger;
      this.previous = {hour: this.hour, minute: this.minute, day: this.day};
      if (options) {
         Object.assign(this.options, options);
         this.startTime = options.startTime || this.startTime;
         if (options.monitorInterval) {
            this.intervalId = setInterval(async => {
               this.logger.debug('monitor', this.minute.publish());
            }, options.monitorInterval);
         }
      }
      this.minuteIntervalId = setInterval(async => {
         this.logger.info('minute', this.previous.minute.publish(), this.minute.publish());
         this.previous.minute = this.minute;
         this.minute = new Sample('minute');
      }, Millis.fromMinutes(1));
      this.hourIntervalId = setInterval(async => {
         this.log('hour', this.previous.hour);
         this.previous.hour = this.hour;
         this.hour = new Sample('hour');
      }, Millis.fromHours(1));
      this.dayIntervalId = setInterval(async => {
         this.log('day', this.previous.day);
         this.previous.day = this.day;
         this.day = new Sample('day');
      }, Millis.fromDays(1));
   }

   log(period, sample) {
      this.logger.info('log', period, {
         previous: sample.publish(),
         session: this.session.publish(),
         day: this.day.publish(),
         hour: this.hour.publish()
      });
   }


   publish(period) {
      if (!period || period === 'session') {
         return {
            startTime: Dates.formatShortISO(this.startTime),
            currentTime: new Date().toISOString(),
            session: this.session.publish(),
            day: this.day.publish(),
            hour: this.hour.publish(),
            minute: this.minute.publish(),
            previous: {
               day: this.previous.day.publish(),
               hour: this.previous.hour.publish(),
               minute: this.previous.minute.publish(),
            }
         };
      } else {
         return {
            period: period,
            startTime: Dates.formatShortISO(this[period].startTime),
            currentTime: new Date().toISOString(),
            current: this[period].publish(),
            previous: this.previous[period].publish(),
            session: this.session.publish(),
            day: this.day.publish(),
            previousPeriods: {
               day:this.previous.day.publish(),
               hour: this.previous.hour.publish(),
               minute: this.previous.minute.publish()
            }
         };
      }
   }

   end() {
      if (this.monitorIntervalId) {
         clearInterval(this.monitorIntervalId);
      }
      clearInterval(this.minuteIntervalId);
      clearInterval(this.hourIntervalId);
      clearInterval(this.dayIntervalId);
   }

   incr(key) {
      this.hour.incr(key);
      this.minute.incr(key);
      this.day.incr(key);
      this.session.incr(key);
   }

   max(key, value) {
      this.hour.max(key);
      this.minute.max(key);
      this.day.max(key);
      this.session.max(key, value);
   }

   peak(key, value) {
      this.hour.peak(key);
      this.minute.peak(key);
      this.day.peak(key);
      this.session.peak(key, value);
   }

   time(key, options) {
      if (options) {
         if (Numbers.isInteger(options)) {
            options = Object.assign({startTime: options}, this.options);
         } else {
            options = Object.assign({startTime: this.startTime}, this.options, options);
         }
      } else {
         options = this.options;
      }
      this.hour.time(key, options);
      this.minute.time(key, options);
      this.day.time(key, options);
      this.session.time(key, options);
   }
}
