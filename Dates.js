// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function time() {
   return new Date().getTime()
}

export function formatShortISO(value) {
   assert(value);
   if (Numbers.isInteger(value)) {
      value = new Date(value);
   }
   assert(value.constructor.name === 'Date');
   return value.toISOString().substring(0, 16);
}
