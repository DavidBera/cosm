const
    hbs = require('./helpers/index'),
    config = require('../../../config'),
    hbsutils = require('hbs-utils')(hbs),
    recursive = require('recursive-readdir');


// hbs.registerPartials(__dirname + '/views/partials');
// hbs.registerPartials(__dirname + '/views/partials/templates');
// hbs.registerPartial('items.i', fs.readFileSync(__dirname + '/views/default/partials/templates/items.hbs', 'utf8'))

hbsutils.registerWatchedPartials('app/views/partials/', {
    // onchange: function (template) {
    //     console.log('new partial ' + template.replace(/\\/g, "/"));
    // },
    name: function (template) {
        return template.replace(/\\/g, "/");
    }
});

function getPartialsNames(callback) {
    let partialsDir = config.get('hbs:partialsDir');
    let names = [];

    let lastChar = partialsDir.substr(partialsDir.length - 1);
    if (lastChar != '/') {
        partialsDir += '/';
    }

    recursive(partialsDir, function (err, files) {
        files.forEach(function (filename) {
            let matches = /^([^.]+).hbs$/.exec(filename);
            if (!matches) {
                return;
            }
            let name = matches[1].replace(/\\/g, "/").slice(partialsDir.length);
            names.push({name: name, path: matches[1]});
        });
        callback(names);
    });
}

hbs.getPartialsNames = getPartialsNames;

module.exports = hbs;
