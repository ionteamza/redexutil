// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

export function createArray(args) {
   return Array.prototype.slice.call(args);
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
