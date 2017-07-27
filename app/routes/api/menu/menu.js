const
    express = require("express"),
    router = express.Router(),
    Menu = require("../../../models").Menu,
    ObjectId = require("mongoose").Types.ObjectId,
    HttpError = require('../../../errors/index').HttpError,
    MenuSchema = require('./menuSchema'),
    validate = require('express-jsonschema').validate,
    auth = require('../../../middleware/auth'),
    async = require('async'),
    pagination = require('../../../libs/pagination/index'),
    filter = require('../../../libs/filter/index'),
    addLinks = require('../../../libs/links/objectLinks').addLinks;

router.get('/', pagination.loadPagination, filter.loadFilter, (req, res, next) => {
    Menu.paginate(req.filter, Object.assign(req.pagination), (err, result) => {
        if (err) return next(500);
        result.docs = result.docs.map(menuItem => {
            return addLinks(menuItem, req);
        });
        res.json(result);
    });
});

router.get('/:id', (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Menu.findById(ObjectId(req.params.id), function (err, result) {
        if (err) return next(500);
        if (!result) return next(404);
        res.json(result);
    });
});

router.post('/', validate({body: MenuSchema}), (req, res, next) => {
    let menu = new Menu(req.body);
    menu.save((err) => {
        if (err) return next(new HttpError(400, err.message));
        let menuObj = addLinks(menu, req);

        delete menuObj['__v'];

        req.io.of('/admin').emit('menu/new', menuObj);
        res.json(menuObj);
    });
});

router.delete('/:id', (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Menu.findByIdAndRemove(req.params.id, function (err, item) {
        if (err) return next(500);
        if (!item) return next();
        res.json(item);
    });
});

router.put('/:id', validate({body: MenuSchema}), (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Menu.findById(req.params.id, function (err, item) {
        if (err) return next(500);
        if (!item) return next();

        item = Object.assign(item, req.body);
        item.save(function (err, updatedMenu) {
            if (err) return next(500);
            if (!updatedMenu) return next();

            res.json(item);
        });


    });
});

module.exports = router;