const
    // path = require('path'),
    util = require('util'),
    models = require('../models'),
    http = require('http');

function HttpError(status, message, redirectUrl) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.redirectUrl = redirectUrl;
    this.message = message || http.STATUS_CODES[status] || 'Error';
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);
    this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

function notFoundErrorHandler(req, res, next) {
    next(new HttpError(404));
}

function validationError(err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
        res.status(400);
        let responseData = {
            validations: err.validations
        };
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        } else {
            res.render('badrequestTemplate', responseData);
        }
    } else {
        next(err);
    }
};

function errorHandler(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }
    models.Menu.find({}, function (dbError, menu) {
        if (dbError) menu = [];
        models.CorePage.findOne({name: 'error'}, function (dbError, page) {
            res.status(err.status || 500);
            if (res.req.headers['content-type'] == 'application/json' || !page) {
                res.json({error: err});
            } else {
                if (err.status == 401) {
                    return res.redirect(err.redirectUrl || '/login');
                }
                if (err.redirectUrl) {
                    return res.redirect(err.redirectUrl);
                }
                page.sections.forEach(function (item) {
                    if (item.id == 'errorSection') {
                        item.message = err.message;
                        item.error = (process.env.NODE_ENV === 'development') ? err : null;
                        item.status = err.status;
                    }
                });
                page.menuLinks = menu;
                page.scripts.push("/static/javascripts/min/error.js");
                res.render('layout', page);
            }
        });
    });
}


exports.HttpError = HttpError;
exports.AuthError = AuthError;
exports.notFoundErrorHandler = notFoundErrorHandler;
exports.errorHandler = errorHandler;
exports.validationError = validationError;

