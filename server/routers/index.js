var router = require('express').Router();

router.use('/article', require('./article'));
// may be other services here

module.exports = router;
