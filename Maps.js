// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function props(object) {
   let map = new Map();
   Object.keys(object).forEach(key => {
      let value = object[key];
      map.set(key, value);
   });
   return map;
}
