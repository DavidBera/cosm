const
    menu = require('./menu').Menu,
    adminMenuSection = require('./adminMenu').AdminMenuSection,
    page = require('./page').Page,
    option = require('./option').Option,
    user = require('./user').User,
    corePage = require('./corePage').CorePage,
    feedback = require('./feedback').Feedback;

exports.Menu = menu;
exports.Option = option;
exports.Page = page;
exports.User = user;
exports.CorePage = corePage;
exports.Feedback = feedback;
exports.AdminMenuSection = adminMenuSection;
