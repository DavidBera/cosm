const
    express = require('express'),
    router = express.Router(),
    auth = require('../../middleware/auth'),
    log = require('../../libs/logger')(module);

router.use('/feedbacks', require('./feedbacks/feedback'));
router.use('/templates-schemas', require('./templatesSchemas/templatesSchemas'));
router.use('/pages', auth.checkAdmin, require('./pages/pages'));
router.use('/menu', auth.checkAdmin, require('./menu/menu'));
router.use('/i18n', require('./i18n/i18n'))

log.info('api module was loaded');

module.exports = router;
