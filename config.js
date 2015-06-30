var debug = !process.env['MONGO_PRODUCT'] || true;
var testdb = process.env['MONGO_TEST'] || "mongodb://test:123456@dbh46.mongolab.com:27467/rest-test";
var productdb = process.env['MONGO_PRODUCT'] || "mongodb://10.10.73.207:27018/Ps_Service";

module.exports = {
  port: process.env.PORT || 8000,
  db: {
    connection: debug ? testdb : productdb,
    timeout: 10000
  },
  log: {
    infoFile: 'info.log',
    errFile: 'err.log',
    logToConsole: debug
  }
}
