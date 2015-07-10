var url = require('url');
var request = require('request');
var router = require('express').Router();
var proxyConfig = require('../../config').proxy;
var proxyUrl = proxyConfig['/att'];

router.use(function(req, res, next) {
  var option = {
			url: url.resolve(proxyUrl, req.path),
			method: req.method,
			headers: req.headers
			// timeout: 8000
		};

		var proxy = request(option);
		// handle proxy exception
		proxy.on("error", function(err) {
			next(err);
		});

		req.pipe(proxy).pipe(res);
});

module.exports = router;
