const
    Menu = require('../models').Menu,
    config = require('../../config/index');

function selectMenuItem(menu, page) {
    menu.forEach(function (item) {
        if (item.href === '/' && page == config.get('app:options:mainPage')) {
            item.active = true;
        }
        if ((item.href == page)) {
            item.active = true;
        }
    });
    return menu;
}

module.exports = function (req, res, next) {
    Menu.find({}, function (dbError, menu) {
        if (dbError || !menu) req.menu = [];

        req.menu = selectMenuItem(menu, req.originalUrl);
        return next();
    });
};