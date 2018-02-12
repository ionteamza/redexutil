// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redexutil/LICENSE

const logger = Loggers.create(__filename, 'info');

export function getDefaultExport(module) {
   if (module.default) {
      return module.default;
   } else {
      return module;
   }
}

export function getDefaultExports(modules) {
   Object.keys(modules).forEach(key => {
      var moduleValue = modules[key];
      if (moduleValue.default) {
         modules[key] = moduleValue.default;
      }
   });
   return modules;
}
