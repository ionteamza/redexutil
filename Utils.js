
const startTime = new Date().getTime();

module.exports = {
   Asserts: require('./Asserts'),
   Collections: require('./Collections'),
   Files: require('./Files'),
   Loggers: require('./Loggers'),
   Millis: require('./Millis'),
   Paths: require('./Paths'),
   Promises: require('./Promises'),
   Redis: require('./Redis'),
   Requests: require('./Requests'),
   Seconds: require('./Seconds')
}

if (process.env.loggerLevel === 'debug') {
   const duration = new Date().getTime() - startTime;
   console.log(module.filename, duration);
}
