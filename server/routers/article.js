var router = require('express').Router();
var Article = require('../model/article');
var resolver = require('../util/resolver');

router.param('article_id', function(req, res, next, id) {
  req.article_id = id;
  next();
});

router.get('/', function(req, res, next) {
  var query = resolver.resolveObject(req.query);
  Article.query(query.conditions, query.fields, query.options)
    .then(function(articles) {
      res.json(articles);
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/:article_id', function(req, res, next) {
    var query = resolver.resolveObject(req.query);
    Article.get(req.article_id, query.fields, query.options)
      .then(function(article) {
        res.json(article);
      })
      .catch(function(err) {
        next(err);
      });
});

router.post('/', require('body-parser').json(), function(req, res, next) {
  Article.post(req.body)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      next(err);
    });
});

router.put('/:article_id', require('body-parser').json(), function(req, res, next) {
  Article.update(req.article_id, req.body)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      next(err);
    });
});

router.delete('/:article_id', function(req, res, next) {
  Article.remove(req.article_id)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      next(err);
    });
});

module.exports = router;
