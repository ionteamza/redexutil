
export function pathname(url) {
   let match = url.match(/https?:\/\/([^\/]+)(\/\S+)$/);
   if (match) {
      return match[2].replace(/\?.*$/, '');
   } else {
      return url;
   }
}
