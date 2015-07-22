var debug = (process.env['PRODUCT'] != 'true');
var testdb = process.env['MONGO_DOC_TEST'] || process.env['MONGO_TEST'] || "mongodb://10.10.73.207:27017,10.10.73.208:27017/PSPMS";
var productdb = process.env['MONGO_DOC_PRODUCT'] || "mongodb://10.10.73.207:27017,10.10.73.208:27017/PSPMS";

module.exports = {
  port: process.env['DOC_PORT'] || 8000,
  db: {
    connection: debug ? testdb : productdb,
    timeout: 30000 //  30s
  },
  log: {
    infoFile: 'info.log',
    errFile: 'err.log',
    logToConsole: debug
  },
  proxy: {
    '/att': process.env['PROXY_ATTACHMENT'] || "http://10.10.73.209:8000/"
  }
};
