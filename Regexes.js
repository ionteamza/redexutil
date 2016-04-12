// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function extract(regex, string) {
   let match = string.match(regex);
   if (match && match.length > 1) {
      return match[1];
   }
}

export function replace(regex, string, replace) {
   let match = string.match(regex);
   if (match && match.length > 1) {
      return string.replace(regex, raplace);
   }
   return string;
}
