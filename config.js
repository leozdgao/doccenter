var debug = (process.env['PRODUCT'] != 'true');
var testdb = process.env['MONGO_DOC_TEST'] || process.env['MONGO_TEST'] || "mongodb://10.10.73.207:27018/test";
var productdb = process.env['MONGO_DOC_PRODUCT'] || "mongodb://10.10.73.207:27018/Ps_Service";

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
