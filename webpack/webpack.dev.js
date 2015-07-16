import webpack from 'webpack';
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("[name].css")
  ],
  loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      exclude: /(node_modules|bower_components)/
    }, {
      test: /\.less/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
    }]
}
