const
    express = require('express'),
    router = express.Router(),
    auth = require('../../middleware/auth'),
    log = require('../../libs/logger')(module);

let login = require('./login'),
    logout = require('./logout');

router.use('/login', login);
router.use('/logout', auth.checkUser, logout);

log.info('auth module was loaded');

module.exports = router;
