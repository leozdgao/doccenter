// promisify first
var Promise = require('bluebird');
var mongoose = require('mongoose');
Promise.promisifyAll(mongoose);

// create app
var express = require('express');
var httpProxy = require('http-proxy');
var ip = require('ip');
var path = require('path');
var pen = require('elecpen');
var config = require('../config');
require('colors');

var logger = pen.createLogger(config.log);

var development = process.env.NODE_ENV !== 'production';
var port = process.env.PORT || 4000;

var app = express();

// service routers
app.use('/service', require('./routers/index'));

// proxy to webpack dev server if development mode
if(development) {
  console.log('[Development] Create proxy server.');
  var proxy = httpProxy.createProxyServer();
  var webpackPort = process.env.WEBPACK_DEV_PORT;
  var target = "http://" + ip.address() + ":" + webpackPort;

  app.get('/assets/*', function (req, res) {
    proxy.web(req, res, { target: target });
  });

  proxy.on('error', function(e) {
    console.log('Could not connect to webpack proxy'.red);
    console.log(e.toString().red);
  });
}
else {
  console.log('[Production] Serve assets for production mode'.green);
  app.use('/assets', express.static(path.join(__dirname, '../assets')));
}

// return index for other request
app.use(require('./routers/other'));

// handle error
app.use(function(err, req, res, next) {
  logger.error(err.message);
  res.status(500).json({msg: err.message});
});

// connect to db async
var connected = false;

// set db connectiion config, timeout
var timeout = config.db.timeout || 5000;
var dbConfig = {
  server: {
    socketOptions: { connectTimeoutMS: timeout }
  }
};

mongoose.connect(config.db.connection, dbConfig);
logger.info("Try to connect to DB, timeout set to " + timeout + "ms");

mongoose.connection.on("connected", function() {
  logger.info("Connected to DB...");
  connected = true;
});

mongoose.connection.on("disconnected", function() {
  // after a successful connecting,
  // mongoose will reconnect automatically if connection disconnected.
  if(!connected) {
    logger.warning("DBConnection closed. Try to reconnect.");

    setTimeout(function() {
      mongoose.connection.open(config.db.connection, dbConfig);
    }, timeout);
  }
});

mongoose.connection.on("error", function(err) {
  logger.error("Error occurred: " + err.message);
});

app.listen(port, function() {
  logger.info("Server listening on port " + port);
});
