var router = require('express').Router();
var request = require("request");
var url = require("url");

var proxyDic = require("./../config.json").proxyDic || {};

for (var key in proxyDic) {

	router.use(key, proxyHandler(proxyDic[key]));
}

module.exports = router;

function proxyHandler(path) {

	return function(req, res, next) {

		var option = {
			url: url.resolve(path, req.originalUrl),
			method: req.method,
			headers: req.headers,
			timeout: 5000 //5s timeout
		};

		var proxy = request(option);
		// handle proxy exception
		proxy.on("error", function(err) {

			res.statusCode = 500;
			res.end();
		});

		req.pipe(proxy).pipe(res);
	}
}
