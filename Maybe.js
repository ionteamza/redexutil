// Copyright (c) 2015, Evan Summers (twitter.com/evanxsummers)
// ISC license, see http://github.com/evanx/redex/LICENSE

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
