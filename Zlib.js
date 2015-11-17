// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import zlib from 'zlib';

import Promises from './Promises';
import Loggers from './Loggers';

const logger = Loggers.create(__filename, 'info');

export function gzip(string) {
   return Promises.create(cb => zlib.gzip(string, cb));
}

export function gunzip(buffer) {
   return Promises.create(cb => zlib.gunzip(buffer, cb));
}
