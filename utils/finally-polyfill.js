import { getType } from "./index.js"

function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    },
    function (reason) {
      return constructor.resolve(callback()).then(function () {
        return constructor.reject(reason);
      });
    }
  );
}

if (getType(Promise.prototype['finally']) !== 'function') {
  Promise.prototype['finally'] = finallyConstructor;
}