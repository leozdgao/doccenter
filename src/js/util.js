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
  method='GET',
  url, onload, onerror, body,
  headers={
    "Content-Type": "application/json"
  },
  timeout=5000}) {
  let xhr = new XMLHttpRequest();console.log(method);
  xhr.open(method, url);
  for(let key in headers) if(headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, headers[key]);
  }
  if(isDefined(xhr.timeout)) {
    xhr.timeout = timeout;
    xhr.ontimeout = () => {
      onerror.call(xhr, true);
    };
  }
  else {
    setTimeout(() => {
      xhr.abort();
      onerror.call(xhr, true);
    }, timeout);
  }
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {
      if(/^(?:2\d{2}|304)$/.test(xhr.status)) onload.call(xhr);
      else onerror.call(xhr, false);
    }
  };

  xhr.send(JSON.stringify(body));
}
