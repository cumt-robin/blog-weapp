export function getType(val) {
  return Object.prototype.toString.call(val).replace(/^\[object\s(\w+)\]$/, '$1').toLowerCase();
}

function isNumber(val) {
  return getType(val) === 'number'
}

function isString(val) {
  return getType(val) === 'string'
}

function isBool(val) {
  return getType(val) === 'boolean'
}

function isUndefined(val) {
  return getType(val) === 'undefined'
}

function isNull(val) {
  return getType(val) === 'null'
}

function isNullOrUndef(val) {
  return isNull(val) || isUndefined(val)
}

function isUseless(val) {
  return isNullOrUndef(val) || val === ''
}

function isDefined(val) {
  return !isUndefined(val) && !isNull(val)
}

function isObject(val) {
  return getType(val) === 'object'
}

function isFunction(val) {
  return getType(val) === 'function'
}

function isArray(val) {
  return isFunction(Array.isArray) ? Array.isArray(val) : getType(val) === 'array'
}

function isBasicType(val) {
  return isNumber(val) || isString(val) || isBool(val) || isUndefined(val) || isNull(val)
}

// 暂时只用来判断String,Array,Object类型
function isEmpty(val) {
  let dataType = getType(val);
  if (dataType === 'object') {
    return Object.keys(val).length === 0
  } else if (dataType === 'array' || dataType === 'string') {
    return val.length === 0
  }
}

// 深拷贝，此处不考虑Symbol,Map,Set,Function等数据类型
function deepClone(obj) {
  let newObj;
  if (isObject(obj)) {
    newObj = {};
    Object.keys(obj).forEach(key => {
      newObj[key] = deepClone(obj[key])
    })
  } else if (isArray(obj)) {
    newObj = [];
    obj.forEach(item => {
      newObj.push(deepClone(item))
    })
  } else {
    newObj = obj;
  }
  return newObj
}

// 比较值是否一样，如果是引用类型，会通过枚举方式去比较值
function isEqual(obj1, obj2) {
  let [type1, type2] = [getType(obj1), getType(obj2)]
  if (type1 === type2) {
    if (isBasicType(obj1)) {
      return obj1 === obj2
    } else if (type1 === 'object') {
      return Object.keys(obj1).every(key => {
        return isEqual(obj1[key], obj2[key])
      })
    } else if (type1 === 'array') {
      return obj1.every((item, index) => {
        return isEqual(item, obj2[index])
      })
    } else if (type1 === 'function' || type1 === 'symbol') {
      return obj1.toString() === obj2.toString();
    } else if (type1 === 'map') {
      let handledKeys = Array.from(map.keys())
      return handledKeys.every(key => isEqual(obj1.get(key), obj2.get(key)))
    } else if (type1 === 'set') {
      let handledArray1 = Array.from(set1.values())
      let handledArray2 = Array.from(set1.values())
      return handledArray1.every((item, index) => isEqual(item, handledArray2[index]))
    } else {
      // 未知类型
      return false;
    }
  } else {
    // 类型不一致，无需比较
    return false;
  }
}

function contains(obj, item) {
  let dataType = getType(obj);
  let containFlag = false;
  if (dataType === 'object') {
    let keys = Object.keys(obj)
    for (let index = 0; index < keys.length; index++) {
      if (isEqual(keys[index], item)) {
        containFlag = true;
        break;
      } else {
        continue;
      }
    }
  } else if (dataType === 'array') {
    for (let index = 0; index < obj.length; index++) {
      if (isEqual(obj[index], item)) {
        containFlag = true;
        break;
      } else {
        continue;
      }
    }
  } else {
    throw new Error('only support type of object or array!')
  }
  return containFlag;
}

function findIndex(arr, item) {
  let targetIndex = -1;
  for (let index = 0; index < arr.length; index++) {
    if (isEqual(arr[index], item)) {
      targetIndex = index;
      break;
    } else {
      continue;
    }
  }
  return targetIndex;
}

// 主要是用于处理ajax参数，此处不考虑Symbol,Map,Set,Function等数据类型
// isStrict默认为false，过滤掉参数中的null,undefined；当isStrict为true时，会过滤掉空字符串
// checkArr默认为false，不会处理数组中的null,undefined，例如[1,undefined,null]这种数据不会做处理；当checkArr为true时，则会进行过滤，此时如果isStrict为true，还会过滤空字符串
function dataFilter(obj, isStrict = false, checkArr = false) {
  let objType = getType(obj);
  if (objType === 'object') {
    let newObj = {};
    for (key in obj) {
      let isDataValid = isStrict ? !isUseless(obj[key]) : isDefined(obj[key])
      if (obj.hasOwnProperty(key) && isDataValid) {
        newObj[key] = dataFilter(obj[key], isStrict, checkArr)
      }
    }
    return newObj
  } else if (objType === 'array') {
    let newArr = [];
    obj.forEach(item => {
      let itemType = getType(item)
      if (itemType === 'object' || itemType === 'array') {
        newArr.push(dataFilter(item, isStrict, checkArr))
      } else if (checkArr) {
        let isDataValid = isStrict ? !isUseless(item) : isDefined(item)
        if (isDataValid) {
          newArr.push(item)
        }
      } else {
        newArr.push(item)
      }
    })
    return newArr;
  } else {
    return obj
  }
}

// 合并两个数据，用于支撑merge方法
function mergeTwo(obj1, obj2) {
  let dataType1 = getType(obj1);
  let dataType2 = getType(obj2);
  if (dataType1 === dataType2) {
    // 如果合并的两个数据类型一致
    if (dataType1 === 'object') {
      // Object类型
      Object.keys(obj2).forEach(key => {
        // 遍历obj2的keys
        if (obj1.hasOwnProperty(key)) {
          // 如果obj1包含obj2的key，采用合并策略
          obj1[key] = mergeTwo(obj1[key], obj2[key])
        } else {
          // 不包含，则直接赋值
          obj1[key] = deepClone(obj2[key])
        }
      })
    } else if (dataType1 === 'array') {
      // Array类型
      obj2.forEach(item => {
        // 遍历obj2
        if (contains(obj1, item)) {
          // 合并数组不能forEach按顺序遍历，只能判断是否包含，如果obj1包含item，采用合并策略
          let dataindex = findIndex(obj1, item);
          obj1[dataindex] = mergeTwo(obj1[dataindex], item)
        } else {
          // 不包含，直接push
          obj1.push(deepClone(item))
        }
      })
    } else if (isBasicType(obj1)) {
      obj1 = obj2
    }
  } else {
    // 数据类型不一致，取后面的数据值
    obj1 = deepClone(obj2)
  }
  return obj1;
}

// 合并多个对象
export function merge(srcObj, ...objs) {
  let srcObjType = getType(srcObj)
  if (srcObjType === 'object' || srcObjType === 'array') {
    let isSameType = objs.every(item => {
      return getType(item) === srcObjType
    })
    if (isSameType) {
      // 是同样的类型，进行合并操作
      if (srcObjType === 'object') {
        // object
        let params = {};
        return [srcObj, ...objs].reduce((preVal, curVal) => {
          return mergeTwo(preVal, curVal)
        }, {})
      } else {
        // array
        let params = [];
        return [srcObj, ...objs].reduce((preVal, curVal) => {
          return mergeTwo(preVal, curVal)
        }, [])
      }
    } else {
      // 类型不一致，直接深拷贝源对象
      return deepClone(srcObj)
    }
  } else {
    // 其他数据类型
    throw new Error('only support type of object or array!');
  }
}

export function debounce(func, wait, options) {
  var lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime,
    lastInvokeTime = 0,
    leading = false,
    maxing = false,
    trailing = true;

  if (typeof func != 'function') {
    throw new TypeError('first param must be function.');
  }
  wait = Number(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced() {
    var time = Date.now(),
      isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

export function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}
