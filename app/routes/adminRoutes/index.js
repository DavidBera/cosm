const
    express = require('express'),
    router = express.Router(),
    log = require('../../libs/logger')(module);

var
    admin = require('./base'),
    staticPages = require('./staticPages');

router.use('/pages', staticPages);
router.use('/', admin);

log.info('admin module was loaded');

module.exports = router;
