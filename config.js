var debug = true;

module.exports = {
  port: process.env.PORT || 4000,
  db: {
    connection: debug ? "mongodb://10.10.73.207:27018/test": "mongodb://10.10.73.207:27018/Ps_Service"
  },
  log: {
    infoFile: 'info.log',
    errFile: 'err.log',
    logToConsole: debug
  }
}
