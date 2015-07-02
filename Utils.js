
import assert from 'assert';
import lodash from 'lodash';

const startTime = new Date().getTime();

['assert', 'lodash', 'path',
   ].forEach(moduleName => {
   module.exports[moduleName] = require(moduleName);
});

module.exports._ = module.exports.lodash;

['Asserts', 'Collections', 'Errors', 'Files', 'Loggers', 'Millis', 'Maybe', 'Paths',
   'Promises', 'Requests', 'Seconds', 'YamlFiles'
   ].forEach(moduleName => {
      module.exports[moduleName] = require('./' + moduleName);
});

if (process.env.loggerLevel === 'debug') {
   const duration = new Date().getTime() - startTime;
   console.log(module.filename, duration, Object.keys(module.exports));
}
