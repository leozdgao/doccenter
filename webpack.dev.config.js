require("babel-core/register");

var _ = require('lodash');

module.exports = _.assign({}, require('./webpack/webpack'), require('./webpack/webpack.dev'));
