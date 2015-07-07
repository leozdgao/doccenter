var url = require('url');
var request = require('request');
var router = require('express').Router();
var Article = require('../model/article');
// var proxy = require('../util/proxy');
var proxyConfig = require('../../config').proxy;
var proxyUrl = proxyConfig['/att'];

router.param('att_key', function(req, res, next, key) {
  req['att_key'] = key;
  next();
});

router.get('/:att_key', function(req, res, next) {
  var key = req['att_key'];
  var proxy = request(url.resolve(proxyUrl, key));
  req.pipe(proxy).pipe(res);
});

router.post('/', function() {
  // proxy(proxyUrl)
  //   .then(function(pres) {
  //     // add attachments entry
  //   });
});

router.delete('/:att_key', function() {
  var key = req['att_key'];
  // proxy(url.resolve(proxyUrl, key))
  //   .then(function(pres) {
  //     // remove attachments entry
  //   });
});

module.exports = router;
