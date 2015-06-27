var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    lastUpdateDate: { type: Date, default: new Date() },
    tags: { type: [String] },
    priority: { type: Number, default: 0 },
    content: { type: String, required: true },
    comments: { type: Array }
}, { collection: 'articles', versionKey: false });

var Article = mongoose.model('Article', articleSchema);

exports.get = function(id) {
  var args = [].slice.call(arguments, 1);
  args.unshift({ _id: id });
  return Article.findOneAsync.apply(Article, args);
};

exports.query = Article.findAsync.bind(Article);

exports.post = function(obj) {
  var newArticle = new Article(obj);
  return newArticle.saveAsync();
};

exports.update = function(id, update, opts) {
  if(typeof update.lastUpdateDate === 'undefined') update.lastUpdateDate = new Date();
  return Article.findByIdAndUpdateAsync(id, update, opts);
}

exports.remove = Article.findByIdAndRemoveAsync.bind(Article);

exports.count = Article.countAsync.bind(Article);

exports.tags = function() {
  var o = {
    map: function() {
      emit(1, { tags: this.tags });
    },
    reduce: function(key, values) {
      var result = { tags: [] };
      values.forEach(function(val) {
          val.tags.forEach(function(i) {
              if(result.tags.indexOf(i) < 0) result.tags.push(i);
          });
      });
      return result;
    }
  };
  return Article.mapReduceAsync(o);
}

// exports.page = function(match, limit, page) {
//   return Tip.aggregateAsync([{ $match: match },
//     { $sort: { priority: -1, date: -1 } },
//     { $skip: (page - 1) * limit },
//     { $limit: limit } ])
// }
