var fs = require('fs');
var path = require('path');

// a middleware for spa, which only return the index file for other requests.
module.exports = function(req, res, next) {
  fs.createReadStream(path.join(__dirname, '../../src/index.html')).pipe(res);
};
