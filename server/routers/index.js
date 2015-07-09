var router = require('express').Router();

router.use('/article', require('./article'));
router.use('/file', require('./file'));
// may be other services here

module.exports = router;
