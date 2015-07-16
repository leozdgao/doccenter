var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var wpconfig = require('./webpack.dev.config');
var dev = require('./config').dev;

new WebpackDevServer(webpack(wpconfig), {
  publicPath: wpconfig.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(dev.hotServerPort, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log("Listening at localhost:" + dev.hotServerPort);
});

//--------------------------------------------------

require('./server/server.js');
