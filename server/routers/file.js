var url = require('url');
var request = require('request');
var router = require('express').Router();
var proxyConfig = require('../../config').proxy;
var proxyUrl = proxyConfig['/att'];

// router.param('att_key', function(req, res, next, key) {
//   req['att_key'] = key;
//   next();
// });
//
// router.get('/:att_key', function(req, res, next) {
//   var key = req['att_key'];
//   var proxy = request(url.resolve(proxyUrl, key));
//   req.pipe(proxy).pipe(res);
// });
//
// router.post('/:aid', function(req, res, next) {
//   var aid = req.params.aid;
//   var proxy = request(url.resolve(proxyUrl, key));
//   proxy.on('response', function(pres) {
//     Article.update(aid, {attachments: { $pull: pres.key }})
//       .then(function(article) {
//         res.json(article);
//       })
//       .catch(function(e) {
//         next(e);
//       });
//   });
// });

// router.delete('/:att_key', function() {
//   var key = req['att_key'];
  // proxy(url.resolve(proxyUrl, key))
  //   .then(function(pres) {
  //     // remove attachments entry
  //   });
// });


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
