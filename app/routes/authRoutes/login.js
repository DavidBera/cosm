var express = require('express');
var router = express.Router();
var models = require('../../models/index');
var errors = require('../../errors/index');

router.post('/', function (req, res, next) {
    let login = req.body.login;
    let password = req.body.password;
    models.User.authorize(login, password, function (err, user) {
        if (err) {
            if (err instanceof errors.AuthError) {
                return next(new errors.HttpError(403, err.message));
            }
            return next(err)
        }
        req.session.user = user._id;
        res.json({
            redirectUrl: req.query.redirect || '/'
        });
    });
});

router.get('/', function (req, res, next) {
    models.CorePage.findOne({name: 'login'}, function (dbError, page) {
        if (dbError) return next(err);
        if (!page) return next();
        res.render('layout', page);
    })
});

module.exports = router;


