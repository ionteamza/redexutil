// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export default class Store {
   counts = {};

   incr(key) {
      if (!this.counts[key]) {
         this.counts[key] = 1;
      } else {
         this.counts[key] += 1;
      }
   }
}
