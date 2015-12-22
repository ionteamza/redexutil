// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export default class Sample {
   counts = {};
   averages = {};
   slow = {};
   peaks = {};
   totals = {};

   constructor(name, startTime) {
      this.name = name;
      this.startTime = startTime || new Date().getTime();
   }

   publish() {
      return {
         startTime: Dates.formatShortISO(this.startTime),
         counts: this.counts,
         slow: this.slow,
         peaks: this.peaks,
         averages: this.averages
      };
   }

   has(key) {
      return this.counts.hasOwnProperty(key);
   }

   value(key) {
      return this.counts[key];
   }

   incr(key) {
      if (!this.has(key)) {
         this.counts[key] = 1;
      } else {
         this.counts[key] += 1;
      }
      return this.counts[key];
   }

   max(key, value) {
      if (!this.has(key)) {
         this.counts[key] = value;
      } else if (value > this.counts[key]) {
         this.counts[key] = value;
      }
   }

   peak(key, value) {
      let count = this.incr(key);
      let total = value;
      if (this.totals.hasOwnProperty(key)) {
         total += this.totals[key];
      }
      this.totals[key] = total;
      let average = total/count;
      this.averages[key] = average;
      let peak = this.peaks[key];
      if (!peak) {
         this.peaks[key] = value;
         peak = value;////
      } else if (value > peak) {
         this.peaks[key] = value;
         peak = value;
         logger.info('peak', this.startTime, key, peak, count, average);
      }
      return peak;

   }

   time(key, options) {
      let startTime = this.startTime;
      if (options) {
         if (options.startTime) {
            startTime = options.startTime;
         }
      }
      let duration = Millis.getElapsedDuration(startTime);
      if (options) {
         if (options.slowLimit) {
            if (duration > options.slowLimit) {
               Objects.incr(this.slow, key);
            }
         }
      }
      this.peak(key, duration);
   }
}
