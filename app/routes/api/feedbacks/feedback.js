const
    express = require("express"),
    router = express.Router(),
    Feedback = require("../../../models/feedback").Feedback,
    ObjectId = require("mongoose").Types.ObjectId,
    HttpError = require('../../../errors/index').HttpError,
    FeedbackSchema = require('./feedbackSchema'),
    validate = require('express-jsonschema').validate,
    auth = require('../../../middleware/auth'),
    async = require('async'),
    pagination = require('../../../libs/pagination/index'),
    filter = require('../../../libs/filter/index');

router.post("/", validate({body: FeedbackSchema}), function (req, res, next) {
    const feedbackEntity = req.body;
    feedbackEntity.status = 'NEW';
    let feedback = new Feedback(feedbackEntity);
    feedback.save((err) => {
        if (err) return next(new HttpError(400, err.message));
        let feedbackObj = feedback.toObject();
        delete feedbackObj['message'];
        req.io.of('/admin').emit('feedbacks/new', feedbackObj);
        res.json(feedbackObj);
    });
});

router.get("/", auth.checkAdmin, pagination.loadPagination, filter.loadFilter, function (req, res, next) {
    Feedback.paginate(req.filter, Object.assign({lean: false}, req.pagination), (err, result) => {
        if (err) return next(500);
        result.docs = result.docs.map(feedback => {
            let feedbackObj = Object.assign(feedback.toObject(), {
                _links: {
                    self: req.fullUrl + "/" + feedback._id
                }
            });
            delete feedbackObj.message;
            return feedbackObj;
        });
        res.json(result);
    });
});

router.get("/:id", auth.checkAdmin, function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Feedback.findById(ObjectId(req.params.id), function (err, result) {
        if (err) return next(500);
        if (!result) return next(404);
        res.json(result);
    });
});

router.get("/status/:status/count", auth.checkAdmin, function (req, res, next) {
    let status = req.params.status;
    let regex = new RegExp(["^", status, "$"].join(""), "i");
    Feedback.count({status: regex}, function (err, result) {
        if (err) return next(500);
        res.json({
            status: status.toUpperCase(),
            count: result
        });
    });
});

router.post("/:id/view", auth.checkAdmin, function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Feedback.findById(req.params.id, function (dbError, feedback) {
        if (dbError) return next(dbError);
        if (!feedback) return next();

        feedback.status = "VIEWED";
        feedback.save(function (err, item) {
            if (err) next(err);
            if (!item) return next();

            let feedbackObj = item.toObject();
            delete feedbackObj['message'];
            delete feedbackObj['phone'];
            req.io.of('/admin').emit('feedbacks/viewed', feedbackObj);
            res.json(item);
        });
    });
});

router.delete('/:id', auth.checkAdmin, function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) return next(404);
    Feedback.findByIdAndRemove(req.params.id, function (err, item) {
        if (err) return next(500);
        if (!item) return next();
        res.json(item);
    });
});

module.exports = router;
