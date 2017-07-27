const
    express = require('express'),
    config = require('../../../config/index'),
    extend = require('extend'),
    models = require('../../models/index'),
    menuMiddleware = require('../../middleware/loadMainMenu'),
    router = express.Router();

router.get('/', menuMiddleware, function (req, res, next) {
    req.params.page = config.get('app:options:mainPage');
    getStaticPage(req, res, next);
});

router.get('/:page', menuMiddleware, getStaticPage);

function getStaticPage(req, res, next) {
    models.Page.findOne({
            $or: [
                {url: req.params.page},
                {$and: [{name: req.params.page}, {url: {$exists: false}}]}
            ]
        }, function (dbError, page) {
            if (dbError) return next(500);
            if (!page) return next();
            page.menuLinks = req.menu;
            res.render('layout', page);
        }
    )
}

module.exports = router;