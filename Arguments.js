// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename);

export function createArray(args) {
   return Array.prototype.slice.call(args);
}

export function coalesce() {
   assert(arguments.length, 'arguments');
   for (let i = 0; i < arguments.length - 1; i++) {
      if (arguments[i]) {
         return arguments[i];
      }
   }
   return arguments[arguments.length - 1];
}

export function joinColon() {
   return Array.prototype.slice.call(arguments).join(':');
}

export function joinDash() {
   return Array.prototype.slice.call(arguments).join('-');
}

export function joinSpace() {
   return Array.prototype.slice.call(arguments).join(' ');
}
