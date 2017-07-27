const
    express = require("express"),
    router = express.Router(),
    Page = require("../../../models/page").Page,
    ObjectId = require("mongoose").Types.ObjectId,
    HttpError = require('../../../errors/index').HttpError,
    FeedbackSchema = require('./../feedbacks/feedbackSchema'),
    validate = require('express-jsonschema').validate,
    auth = require('../../../middleware/auth'),
    async = require('async'),
    pagination = require('../../../libs/pagination/index'),
    filter = require('../../../libs/filter/index');

router.get('/', pagination.loadPagination, filter.loadFilter, (req, res, next) => {
    Page.paginate(req.filter, Object.assign({select: '-scripts -head -sections'}, req.pagination), (err, result) => {
        if (err) return next(500);
        result.docs = result.docs.map(page => {
            page._links = {
                self: req.fullUrl + "/" + page._id
            };
            return page;
        });
        res.json(result);
    });
});

router.get('/:id', (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Page.findById(ObjectId(req.params.id), function (err, result) {
        if (err) return next(500);
        if (!result) return next(404);
        res.json(result);
    });
});

module.exports = router;