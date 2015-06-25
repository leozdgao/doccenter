export function isEmptyString(val) {
  return /^[ ]*$/.test(val);
}

export function isString(val) {
  return typeof val == 'string' || val instanceof String;
}

export function isDefined(val) {
  return val != null;
}

export function ajax({
  method='POST',
  url, onload, onerror, body,
  headers={
    "Content-Type": "application/json"
  },
  timeout=5000}) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  for(let key in headers) if(headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, headers[key]);
  }
  xhr.timeout = timeout;
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
      if(/^(?:2\d{2}|304)$/.test(xhr.status)) onload.call(xhr);
      else onerror.call(xhr, false);
    }
  };
  xhr.ontimeout = function() {
    onerror.call(xhr, true);
  };
  xhr.send(JSON.stringify(body));
}
