export function isEmptyString(val) {
  return /^[ ]*$/.test(val);
}

export function isInteger(val) {
  return typeof val == 'number' && Math.floor(val) == val;
}

export function isString(val) {
  return typeof val == 'string' || val instanceof String;
}

export function isDefined(val) {
  return val != null;
}

export function isArray(val) {
  return Object.prototype.toString.call(val) == '[object Array]'
}

export function dateFormat(date) {
  if(isNaN(Date.parse(date))) return '';

  date = new Date(date);
  let pad2 = (val) => {
    val = String(val);
    return val.length < 2 ? '0' + val : val;
  };

  return date.getFullYear() + '-'
    + pad2(date.getMonth() + 1) + '-'
    + pad2(date.getDate());
}

export function ensure(obj) {
  for(let key in obj) if(obj.hasOwnProperty(key)) {
    if(!isDefined(obj[key])) delete obj[key];
  }
  return obj;
}

export function arrayFrom(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}



export function querystring(obj) {
  let resolved = (function(obj) {
    let result = {};
    let getResolvedObj = (suf, source, dest) => {
        for (var key in source) {
          if(source.hasOwnProperty(key)) {
            var objKey = suf + key;
            var val = source[key];
            // if val is obj
            if(val.toString() === "[object Object]") {
              getResolvedObj(objKey + ".", val, result);
            }
            else {
              result[objKey] = val;
            }
          }
        }
        return dest;
    };
    return getResolvedObj("", obj, result);
  })(obj);

  let params = [];
  for(let key in resolved) if(resolved.hasOwnProperty(key)) {
    params.push(key + '=' + encodeURIComponent(resolved[key]));
  }
  return params.join('&');
}

export function copy(a, b) {
  b = b || (isArray(a) ? [] : {});

  for(let key in a) if(a.hasOwnProperty(key)) {

    if(typeof a[key] == 'object') {
      if(isArray(a[key])) b[key] = copy(a[key], []);
      else b[key] = copy(a[key], {});
    }
    else b[key] = a[key];
  }

  return b;
}
