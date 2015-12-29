
const logger = Loggers.create(__filename);
const urlRegex = /https?:\/\/([^\/]+)(\/\S+)$/;

export function pathname(url) {
   const match = url.match(urlRegex);
   if (match) {
      return match[2].replace(/\?.*$/, '');
   } else {
      logger.error('pathname', url);
   }
}

export function hostname(url) {
   let match = url.match(/https?:\/\/([^\/]+)(\/\S+)$/);
   if (match) {
      return match[1];
   } else {
      logger.error('hostname', url);
   }
}

export function parse(url) {
   let match = url.match(/https?:\/\/([^\/]+)(\/\S+)$/);
   if (match) {
      return {
         hostname: match[1],
         pathname: match[2].replace(/\?.*$/, '')
      };
   } else {
      logger.error('parse', url);
   }
}
