var express = require('express');
var router = express.Router();
var models = require('../../models/index');
var errors = require('../../errors/index');

router.get('/', function (req, res, next) {
    getPage(req, res, next);
});

function getPage(req, res, next) {
    models.AdminMenuSection.find({}, function (dbError, menuSections) {
        let page = req.originalUrl.slice(1);
        if (page.charAt(page.length - 1) === '/') page = page.slice(0, page.length - 1);

        models.CorePage.findOne({name: page}, function (dbError, page) {
            if (dbError) return next(err);
            if (!page) return next();
            page.layout = 'adminLayout';
            page.adminMenuSections = menuSections;
            res.render('layout', page);
        });
    });
}

router.get('/:page', function (req, res, next) {
    models.AdminMenuSection.find({}, function (dbError, menuSections) {
        let pageName = `admin/${req.params.page}`;

        models.CorePage.findOne({
            $or: [
                {url: pageName},
                {$and: [{name: pageName}, {url: {$exists: false}}]}
            ]
        }, function (dbError, page) {
            if (dbError) return next(err);
            if (!page) return next();
            page.layout = 'adminLayout';
            page.adminMenuSections = menuSections;
            res.render('layout', page);
        });
    });
});

module.exports = router;


