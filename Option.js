// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

// similar to Promise, but synchronously invoked

const logger = Loggers.create(__filename, 'info');

export default class Option {

   constructor(has, value) {
      this.has = has;
      this.value = value;
   }

}
