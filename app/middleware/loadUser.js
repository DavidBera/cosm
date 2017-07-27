const
    User = require('../models').User,
    ObjectId = require("mongoose").Types.ObjectId;

module.exports = function (req, res, next) {
    if (res.locals !== undefined) {
        res.locals.user = null;
    }
    req.user = null;
    if (!req.session.user) return next();
    if (!ObjectId.isValid(req.session.user)) return next ();
    User.findById(req.session.user, function (err, user) {
        if (err) return next(err);
        if (res.locals !== undefined) {
            res.locals.user = user;
        }
        req.user = user;
        return next();
    });
};
