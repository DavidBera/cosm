const
    express = require("express"),
    router = express.Router(),
    HttpError = require('../../../errors/index').HttpError,
    validate = require('express-jsonschema').validate,
    auth = require('../../../middleware/auth'),
    async = require('async'),
    pagination = require('../../../libs/pagination/index'),
    filter = require('../../../libs/filter/index');

router.get('/', pagination.loadPagination, filter.loadFilter, (req, res, next) => {
    let phrases = [];
    if (req.filter && req.filter.phrases) {
        phrases = req.filter.phrases instanceof Array ? req.filter.phrases : [req.filter.phrases];
    }
    if (!phrases.length) {
        return res.json(getCatalog(req));
    }

    let result = {};
    phrases.forEach((phrase) => {
        result[phrase] = __(phrase);
    });
    res.json(result);
});

module.exports = router;
