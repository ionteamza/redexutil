// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

import Sample from './Sample';

export default class SampleMonitor {
   hour = new Sample();
   minute = new Sample();
   day = new Sample();
   session = new Sample();
   previous = {};

   constructor(options) {
      this.startTime = options.startTime || new Date().getTime();
      if (options.monitorInterval) {
         this.intervalId = setInterval(async => {
            logger.info('monitor', this);
         }, options.monitorInterval);
      }
      this.minuteIntervalId = setInterval(async => {
         logger.info('minute', this);
         this.previous.minute = this.minute;
         this.minute = new Sample();
      }, Millis.fromMinutes(1));
      this.hourIntervalId = setInterval(async => {
         logger.info('hour', this);
         this.previous.hour = this.hour;
         this.hour = new Sample();
      }, Millis.fromHours(1));
      this.dayIntervalId = setInterval(async => {
         logger.info('day', this);
         this.previous.day = this.day;
         this.day = new Sample();
      }, Millis.fromDays(1));
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
      if (false) {
         this.hour.incr(key);
         this.minute.incr(key);
         this.day.incr(key);
      }
      this.session.incr(key);
   }

   max(key, value) {
      this.session.max(key, value);
   }

   peak(key, value) {
      this.session.peak(key, value);
   }

   time(key, startTime) {
      this.session.time(key, startTime);
   }
}
