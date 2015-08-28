
export function isInteger(value) {
   return value && !isNaN(value) && /^[0-9]+$/.test(value.toString());
}
