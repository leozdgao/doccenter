var url = require('url');
var router = require('express').Router();
var Article = require('../model/article');
var proxy = require('../util/proxy');
var proxyConfig = require('../../config').proxy;
var proxyUrl = proxyConfig['/att'];

router.param('att_key', function(req, res, next, key) {
  req['att_key'] = key;
  next();
});

router.get('/:att_key', function(req, res, next) {
  proxy('path')
    .then(function(pres) {
      // done
    });
});

router.post('/', function() {
  proxy('path')
    .then(function(pres) {
      // add attachments entry
    });
});

router.delete('/:att_key', function() {
  proxy('path')
    .then(function(pres) {
      // remove attachments entry
    });
});

module.exports = router;
