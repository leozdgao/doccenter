// promisify first
import Promise from 'bluebird';
import mongoose from 'mongoose';
Promise.promisifyAll(mongoose);

// create app
import express from 'express';
import httpProxy from 'http-proxy';
import ip from 'ip';
import path from 'path';
import logger from '../util/logger';
import config from '../config';
import 'colors';

const development = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 4000;

let app = express();

// service routers
app.use('/service', require('./routers/index'));

// proxy to webpack dev server if development mode
if(development) {
  console.log('[Development] Create proxy server.');
  let proxy = httpProxy.createProxyServer();
  let webpackPort = process.env.WEBPACK_DEV_PORT;
  let target = `http://${ip.address()}:${webpackPort}`;

  app.get('/assets/*', function (req, res) {
    proxy.web(req, res, { target });
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
let connected = false;

// set db connectiion config, timeout
const timeout = config.db.timeout || 5000;
const dbConfig = {
  server: {
    socketOptions: { connectTimeoutMS: timeout }
  }
};

mongoose.connect(config.db.connection, dbConfig);
logger.info("Try to connect to DB, timeout set to " + timeout + "ms");

mongoose.connection.on("connected", () => {
  logger.info("Connected to DB...");
  connected = true;
});

mongoose.connection.on("disconnected", () => {
  // after a successful connecting,
  // mongoose will reconnect automatically if connection disconnected.
  if(!connected) {
    logger.warning("DBConnection closed. Try to reconnect.");

    setTimeout(() => {
      mongoose.connection.open(config.db.connection, dbConfig);
    }, timeout);
  }
});

mongoose.connection.on("error", (err) => {
  logger.error("Error occurred: " + err.message);
});

app.listen(port, () => {
  logger.info("Server listening on port " + port);
});
