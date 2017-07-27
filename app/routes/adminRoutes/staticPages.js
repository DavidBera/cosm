const
    express = require('express'),
    router = express.Router(),
    models = require('../../models/index');

router.get('/', function (req, res, next) {
    models.AdminMenuSection.find({}, function (dbError, menuSections) {
        models.CorePage.findOne({name: 'admin/pages'}, function (err, page) {
            if (err) return next(500);
            if (!page) return next();

            let perPage = +req.query.perPage || 20;
            let pageNum = +req.query.page || 0;

            models.Page.find()
                .skip(perPage * pageNum)
                .limit(perPage)
                .exec(function (err, result) {
                    if (err) return next(500);
                    page.pages = [];
                    result.forEach(function (item) {
                        item.sections.forEach(function (section) {
                            if (section.template == 'default/templates/content') {
                                item.editable = true;
                            }
                        });
                        page.pages.push(item);
                    });
                    page.layout = 'adminLayout';
                    page.adminMenuSections = menuSections;
                    res.render('adminLayout', page);
                });
        });
    });
});

router.get('/new', getPage);

router.get('/:name', function (req, res, next) {
    models.AdminMenuSection.find({}, function (dbError, menuSections) {
        models.CorePage.findOne({name: 'admin/pages/edit'}, function (err, page) {
            if (err) return next(500);
            if (!page) return next();

            models.Page.findOne({name: req.params.name}, function (dbErrorForPage, editablePage) {
                if (err) return next(err);
                if (!editablePage) return next();
                // if (!editablePage.editable) return next();

                let contentSection = editablePage.sections.find(item => item.id === 'content') || {};

                page.layout = 'adminLayout';
                page.adminMenuSections = menuSections;
                page.pageName = editablePage.name;
                page.content = contentSection.content;
                page.isEdit = true;

                res.render('layout', page);
            });
        });
    });
});

router.delete('/:name', function (req, res, next) {
    models.Page.remove({name: req.params.name}, function (err, item) {
        if (err) return next(500);
        res.json(item);
    });
});

router.post('/:name', function (req, res, next) {
    var pg = {
        name: req.body.name,
        head: {
            styles: ["/static/css/main-style.css", "/static/css/content.css"],
            title: 'Cosm - Наши решения'
        },
        sections: [{
            template: 'default/templates/header',
            logo: {
                text: 'COS<b>M</b>',
                url: '/',
                img: '/static/img/logo-main.svg',
            },
            classes: ['bg-primary'],
            background: '/static/img/computer6sm.jpg',
            title: 'Contact us',
            fullScreen: false
        }, {
            id: 'content',
            classes: ['bg-content', 'content-section'],
            template: 'default/templates/content',
            content: req.body.content,
        },
            {
                id: 'footer',
                template: 'default/templates/footer'
            }],
        scripts: ["/static/javascripts/min/common.js"]
    };
    let page = new models.Page(pg);
    page.save(function (err, item) {
        if (err) next(err);
        else res.json(item);
    });
});

router.put('/:name', function (req, res, next) {
    models.Page.findOne({name: req.params.name}, function (dbErrorForPage, editablePage) {
        if (dbErrorForPage) return next(dbErrorForPage);
        if (!editablePage) return next();

        editablePage.name = req.body.name;
        editablePage.sections.forEach((item, index) => {
            if (item.id === 'content') {
                item.content = req.body.content;
                editablePage.sections.splice(index, 1, Object.assign({}, item));
            }
        });

        editablePage.save(function (err, item) {
            if (err) next(err);
            else res.json(item);
        });
    });
});

function getPage(req, res, next) {
    models.AdminMenuSection.find({}, function (dbError, menuSections) {
        models.CorePage.findOne({name: 'admin/pages/new'}, function (err, page) {
            if (err) return next(500);
            if (!page) return next();
            page.layout = 'adminLayout';
            page.adminMenuSections = menuSections;
            res.render('layout', page);
        });
    });
}

module.exports = router;


