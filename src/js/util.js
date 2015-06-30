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
    + pad2(date.getMonth()) + '-'
    + pad2(date.getDate());
}

export function ensure(obj) {
  for(let key in obj) if(obj.hasOwnProperty(key)) {
    if(!isDefined(obj[key])) delete obj[key];
  }
  return obj;
}

export function ajax({
  method='GET',
  url, body,
  headers={
    "Content-Type": "application/json"
  },
  timeout=5000}) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      for(let key in headers) if(headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
      }
      if(isDefined(xhr.timeout)) {
        xhr.timeout = timeout;
        xhr.ontimeout = () => {
          xhr.hasTimeout = true;
          reject(xhr);
        };
      }
      else {
        setTimeout(() => {
          xhr.abort();
          xhr.hasTimeout = true;
          reject(xhr);
        }, timeout);
      }
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {
          if(/^(?:2\d{2}|304)$/.test(xhr.status)) {
            let res = JSON.parse(xhr.response);
            resolve(res);
          }
          else reject(xhr);
        }
      };

      xhr.send(JSON.stringify(body));
    });
}

ajax.get = (url, headers, timeout) => {
  return ajax({
    url: url,
    headers: headers,
    timeout: timeout
  })
};

ajax.post = (url, body, headers, timeout) => {
  return ajax({
    method: 'POST',
    url: url,
    body: body,
    headers: headers,
    timeout: timeout
  })
};

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
