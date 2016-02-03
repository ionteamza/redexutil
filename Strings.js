// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function formatEmpty(string, defaultString) {
   if (string) {
      return string;
   } else {
      return defaultString || '';
   }
}

export function formatNullable(string) { // deprecated
   return formatEmpty(string);
}

export function padLeftZero(value, length) {
   let string = value.toString();
   while (string.length < length) {
      string = '0' + string;
   }
   return string;
}

export function joinColon() { // deprecated
   return Array.prototype.slice.call(arguments).join(':');
}
