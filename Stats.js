// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import Sample from './Sample';

export default class Stats {
   hour = new Sample('hour');
   minute = new Sample('minute');
   day = new Sample('day');
   session = new Sample('session');

   constructor(source, logger, options) {
      this.logger = logger;
      this.previous = {hour: this.hour, minute: this.minute, day: this.day};
      this.startTime = options.startTime || new Date().getTime();
      if (options.monitorInterval) {
         this.intervalId = setInterval(async => {
            this.log('monitor', this.minute);
         }, options.monitorInterval);
      }
      this.minuteIntervalId = setInterval(async => {
         this.log('minute', this.previous.minute);
         this.previous.minute = this.minute;
         this.minute = new Sample('minute');
      }, Millis.fromMinutes(1));
      this.hourIntervalId = setInterval(async => {
         this.log('hour', this.previous.hour);
         this.previous.hour = this.hour;
         this.hour = new Sample('hour');
      }, 20000 + 0*Millis.fromHours(1));
      this.dayIntervalId = setInterval(async => {
         this.log('day', this.previous.day);
         this.previous.day = this.day;
         this.day = new Sample('day');
      }, 40000 + 0*Millis.fromDays(1));
   }

   publish() {
      return {
         startTime: Dates.formatShortISO(startTime),
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
   }

   log(period, sample) {
      this.logger.info(period, sample, this.hour, this.day, this.session, this.previous);
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

   time(key, startTime) {
      this.session.time(key, startTime);
   }
}
