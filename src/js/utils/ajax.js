import Promise from 'promise-polyfill';
import {isDefined} from './helps';

export function ajax({
  method='GET',
  url, body,
  headers,
  timeout=5000}, onLoad, onError) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      for(let key in headers) if(headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
      }
      if(timeout > 0) {
        if(isDefined(xhr.timeout)) {
          xhr.timeout = timeout;
          xhr.ontimeout = () => {
            xhr.hasTimeout = true;
            onError.call(null, xhr);
          }
        }
        else {
          setTimeout(() => {
            xhr.abort();
            xhr.hasTimeout = true;
          }, timeout);
        }
      }
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {
          if(/^(?:2\d{2}|304)$/.test(xhr.status)) {
            let res = xhr.response && JSON.parse(xhr.response);
            onLoad.call(null, res, xhr);
          }
          else onError.call(null, xhr);
        }
      };
      xhr.onabort = () => {
        onError.call(null, xhr);
      };

      if(body instanceof FormData) xhr.send(body);
      else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(body));
      }

      return xhr;
    };

ajax.promise = ({
  method='GET',
  url, body,
  headers,
  timeout=5000}) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      for(let key in headers) if(headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
      }
      if(timeout > 0) {
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
      }
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {
          if(/^(?:2\d{2}|304)$/.test(xhr.status)) {
            let res = xhr.response && JSON.parse(xhr.response);
            resolve(res);
          }
          else reject(xhr);
        }
      };

      if(body instanceof FormData) xhr.send(body);
      else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(body));
      }
    });
};

ajax.get = (url, headers, timeout) => {
  return ajax.promise({
    url: url,
    headers: headers,
    timeout: timeout
  });
};

ajax.post = (url, body, headers, timeout) => {
  return ajax.promise({
    method: 'POST',
    url: url,
    body: body,
    headers: headers,
    timeout: timeout
  });
};

ajax.put = (url, body, headers, timeout) => {
  return ajax.promise({
    method: 'PUT',
    url: url,
    body: body,
    headers: headers,
    timeout: timeout
  });
};

ajax.delete = (url, headers, timeout) => {
  return ajax.promise({
    method: 'DELETE',
    url: url,
    headers: headers,
    timeout: timeout
  });
};
