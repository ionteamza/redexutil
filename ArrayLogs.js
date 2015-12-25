// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

import lodash from 'lodash';

const logger = Loggers.create(__filename, 'info');

export function formatProps(array, predicate) {
   if (lodash.isEmpty(array)) {
      return 'empty~array';
   } else if (!lodash.isArray(array)) {
      return 'invalid~arrray';
   } else {
      return array.map(item => Objects.keys(item, predicate)
      .map(key => '@' + key + '=' + ObjectLogs.formatString(item[key])).join(' '));
   }
}
