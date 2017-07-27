const
    errors = require('../errors/index');

function checkUser(req, res, next) {
    if (!req.user) {
        return next(new errors.HttpError(401, "You are didn`t authorized!!!", '/login?redirect=' + req.originalUrl));
    }
    next();
}

function checkAdmin(req, res, next) {
    checkUser(req, res, function (err) {
        if (err) return next(err);
        if (req.user.role != 'admin') {
            return next(new errors.HttpError(403, "You shall not pass!!!"));
        }
        next();
    });
}

exports.checkAdmin = checkAdmin;
exports.checkUser = checkUser;

