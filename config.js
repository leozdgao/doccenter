var debug = true;
var testdb = process.env['MONGO_TEST'] || "mongodb://10.10.73.207:27018/test";
var productdb = process.env['MONGO_PRODUCT'] || "mongodb://10.10.73.207:27018/Ps_Service";

module.exports = {
  port: process.env.PORT || 8000,
  db: {
    connection: debug ? testdb : productdb
  },
  log: {
    infoFile: 'info.log',
    errFile: 'err.log',
    logToConsole: debug
  }
}
