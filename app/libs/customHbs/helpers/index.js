const hbs = require('hbs'),
    i18n = require('i18n');

hbs.registerHelper('isFirstInRow', function (v1, v2, options) {
    if (v2 > 6) {
        v2 = 6;
    }
    if (v1 % v2 === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('isLastInRow', function (v1, v2, options) {
    if (v2 > 6) {
        v2 = 6;
    }
    if (v1 % v2 === v2 - 1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
hbs.registerHelper('getCol', function (v1, v2, options) {
    if (v1 > 6) {
        return 2;
    }
    return Math.floor(12 / v1);
});

hbs.registerHelper('even', function (v1, option) {
    if (v1 % 2 === 0) {
        return option.fn(this);
    }
    return option.inverse(this);
});

hbs.registerHelper('midItem', function (v1, v2, option) {
    if (v1 === Math.round(v2 / 2)) {
        return option.fn(this);
    }
    return option.inverse(this);
});

hbs.registerHelper('__', function (a, options) {
    return i18n.__.apply(arguments[arguments.length - 1].data.root, arguments);
});
hbs.registerHelper('__n', function () {
    return i18n.__.apply(arguments[arguments.length - 1].data.root, arguments);
});

module.exports = hbs;
