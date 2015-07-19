import _ from 'lodash';
import ip from 'ip';
import webpack from 'webpack';
import ExtractTextPlugin from "extract-text-webpack-plugin";
import baseConfig, { options, jsLoader } from './baseConfig';

const webpackDevServerAddress = `http://${ip.address()}:${options.port}`;
const cssSourceMap = options.debug ? '?sourceMap' : '';
const reactHot = options.debug ? 'react-hot!' : '';

// define entry in webpack config
const entryFile = './src/js/app.main.js';
const devEntryBundle = [
  'webpack/hot/dev-server',
  `webpack-dev-server/client?${webpackDevServerAddress}`,
  entryFile
];

// add css processor
baseConfig.plugins.push(new ExtractTextPlugin('[name].css'));
if (options.debug) {
  baseConfig.plugins.push(new webpack.NoErrorsPlugin()); // assets will not emit if compiling error
}

export default _.extend({}, baseConfig, {
  entry: {
    bundle: options.debug ? devEntryBundle : entryFile
  },

  output: {
    filename: '[name].js',
    path: './assets',
    publicPath: options.debug ? `${webpackDevServerAddress}/assets/` : '/assets/'
  },

  module: {
    loaders: [
      { test: /\.jsx?$/, loader: `${reactHot}${jsLoader}`, exclude: /node_modules/ },
      { test: /\.css/, loader: ExtractTextPlugin.extract('style', `css${cssSourceMap}`) },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', `css${cssSourceMap}!less${cssSourceMap}`) }
    ]
  }
});
