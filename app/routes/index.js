const
    express = require('express'),
    router = express.Router(),
    log = require('../libs/logger')(module),
    auth = require('../middleware/auth');

let adminRoutes = require('./adminRoutes/index'),
    staticPages = require('./userRoutes/staticPage'),
    authRoutes = require('./authRoutes/index'),
    api = require('./api');

router.get('/partials', function (req, res) {
    const parts = [];
    for (let key in hbs.handlebars.partials) {
        parts.push(key);
    }
    res.json(parts);
});

router.use('/admin', auth.checkAdmin, adminRoutes);
router.use('/api', api);
router.use('/', authRoutes);
router.use('/', staticPages);

module.exports = router;