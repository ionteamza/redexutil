// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export default class Sample {
   values = {};
   averages = {};
   totals = {};

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
   }

   max(key, value) {
      if (!this.has(key)) {
         this.values[key] = value;
      } else if (value > this.values[key]) {
         this.values[key] = value;
      }
   }
}
