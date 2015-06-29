
const Maybe = {
   define(value) {
      return {
         isEmpty() {
            return false;
         },
         toString() {
            return value.toString();
         },
         get value() {
            return value;
         }
      };
   },
   none(message) {
      return {
         isEmpty() {
            return true;
         },
         toString() {
            return message;
         },
         get value() {
            throw message;
         }
      };
   }
};

module.exports = Maybe;
