var router = require('express').Router();

router.use('/article', require('./article'));
router.use('/att', require('./att'));
// may be other services here

module.exports = router;
