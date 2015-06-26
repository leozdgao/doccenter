var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    date: { type: Date, default: new Date() },
    lastUpdateDate: { type: Date, default: new Date() },
    tags: { type: [String] },
    content: { type: String, required: true }
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
