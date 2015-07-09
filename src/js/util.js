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
    return new Promise(function(resolve, reject) {
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

export let AutoIndexer = {};
/**
 * Genrator of an autoIndexer according the options
 * @param  {Object} opts - options for auto indexer
 * @return {Function} An autoIndexer
 */
AutoIndexer.createIndexer = function(opts) {
  opts = opts || {};
  var maxLevel = opts.maxLevel || 3; // max level, default to 3

  // an indexer
  return function (article) {
    // get headers in rootEle
    var nodes = [];
    traverse(article, function(n) {
      var match = /^H([1-6])$/.exec(n.tagName);
      if(match != null) {
        var node = {
          level: match[1],
          anchor: n.id,
          title: n.textContent || n.innerText
        }
        nodes.push(node);
      }
    });

    var root = new Node({level: 0}); // a fake root node
    root.fromArray(nodes, function(cur, last) { // construct Node
      return last.data.level < cur.data.level;
    });

    var result = domUl(), children = root.children;
    for(var i = 0, l = children.length; i < l; i++) {
      result.appendChild(construct(children[i]));
    }

    return result;

    // construct a single node
    function construct(node) {
      var li = domLi();
      li.appendChild(createAnchor(node.data));

      if(node.hasChildren() && node.getDepth() != maxLevel) {
        var children = node.children, ele = domUl();
        for(var i = 0, l = children.length; i < l; i++) {
          ele.appendChild(construct(children[i], domUl()));
          li.appendChild(ele);
        }
      }

      return li;
    }

    // traverse dom node
    function traverse(node, action, filter) {
      if(typeof action != 'function') throw 'action should be a function.';
      if(typeof filter != 'function' || filter(node)) action.call(null, node);

      var children = Array.prototype.slice.call(node.children), l = children.length;
      if(l > 0) {
        for(var i = 0; i < l; i++) {
          traverse(children[i], action, filter);
        }
      }
    }

    // create anchor node by data
    function createAnchor(data) {
      var a = document.createElement('a');
      a.href = location.pathname + '#' + data.anchor;
      a.target = '_self';
      a.textContent = data.title;
      return a;
    }

    function domUl() {
      return document.createElement('ul');
    }

    function domLi() {
      return document.createElement('li');
    }
  }
}



//
//-------------------------------private function-------------------------------------------
//

/**
 * Constructor of a tree node.
 * @constructor Node
 * @param {Object} data - the data which held by a node
 */
function Node(data) {
  this.data = data;
  this.children = [];
  this.parent = null;
}

/**
 * Decide the node is root or not.
 * @return {Boolean}
 */
Node.prototype.isRoot = function () {
  return this.parent == null;
};

/**
 * Decide the node is a sibling of another node.
 * @param  {Node}  node
 * @return {Boolean}
 */
Node.prototype.isSibling = function (node) {
  return !!node && this.parent == node.parent;
};

/**
 * Decide the node has children or not.
 * @return {Boolean}
 */
Node.prototype.hasChildren = function () {
  return this.children.length > 0;
};

/**
 * Get depth of tree node.
 * @return {Number}
 */
Node.prototype.getDepth = function () {
  var i = 0, p = this.parent;
  while(p != null) {
    i++; p = p.parent;
  }
  return i;
};

/**
 * Append node to a parent node.
 * @param  {Node} parent - parent node to append to
 * @return {Node} return parent node
 */
Node.prototype.appendTo = function (parent) {
  if(parent instanceof Node) {
    this.parent = parent;
    parent.children.push(this);
  }

  return parent;
};

/**
 * Append a child to itself.
 * @param  {Node} child - a child to append
 * @return {Node} return itself
 */
Node.prototype.append = function (child) {
  if(child instanceof Node) {
    this.children.push(child);
    child.parent = this;
  }
};

/**
 * Depth-first traversal, a function will be called everytime traverse to a node,
 * it take data as the first argument, and the execute content is binded to Node itself.
 * @param  {Function} action - an action to execute
 * @return {Node} return itself
 */
Node.prototype.traverse = function traverse(action) {
  if(typeof action != 'function') throw 'action should be a function.';

  action.call(this, this.data);
  if(this.children.length > 0) { // not leaf
    for(var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].traverse(action);
    }
  }

  return this;
};

/**
 * Get tree structure from array.
 * @param  {Array} arr - Array source
 * @param  {Function} filter - Decide current node to be last node's child or not
 * @return {Node} return itself
 */
Node.prototype.fromArray = function (arr, filter) {
  var last = this;
  for(var i = 0, l = arr.length; i < l; i++) {
    var node = arr[i], treeNode = new Node(node);
    findParent(treeNode, last, filter);
    last = treeNode;
  }

  function findParent(node, start, filter) {
    if(node == null || start == null) return;
    if(filter(node, start)) {
      start.append(node);
    }
    else {
      findParent(node, start.parent, filter);
    }
  }

  return this;
};
