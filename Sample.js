// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export default class Sample {
   values = {};
   averages = {};
   peaks = {};
   totals = {};

   constructor(name, startTime) {
      this.name = name;
      this.startTime = startTime || new Date().getTime();
   }

   publish() {
      return {
         startTime: Dates.formatShortISO(startTime),
         values: values,
         averages: averages,
         peaks: peaks
      };
   }

   has(key) {
      return this.values.hasOwnProperty(key);
   }

   value(key) {
      return this.values[key];
   }

   incr(key) {
      if (!this.has(key)) {
         this.values[key] = 1;
      } else {
         this.values[key] += 1;
      }
      return this.values[key];
   }

   max(key, value) {
      if (!this.has(key)) {
         this.values[key] = value;
      } else if (value > this.values[key]) {
         this.values[key] = value;
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
         peak = value;
      } else if (value > peak) {
         this.peaks[key] = value;
         peak = value;
         logger.info('peak', this.startTime, key, peak, count, average);
      }
      return peak;

   }

   time(key, startTime) {
      if (!startTime) {
         startTime = this.startTime;
      }
      this.peak(key, new Date().getTime() - startTime);
   }
}
