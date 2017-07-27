const
    express = require("express"),
    router = express.Router(),
    auth = require('../../../middleware/auth'),
    async = require('async'),
    filter = require('../../../libs/filter/index'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path');

router.get('/', auth.checkAdmin, filter.loadFilter, (req, res, next) => {
    let templates =
        req.filter && req.filter.templates instanceof Array
            ? req.filter.templates.filter((v, i, a) => a.indexOf(v) === i)
            : req.filter && typeof req.filter.templates === 'string'
            ? [req.filter.templates] : null;

    if (templates) {
        templates = templates.map(template => path.join(__dirname, `../../../views/schemas/${template}.json`).replace(/\\/g, '/'));
    }

    let sendSchemas = (err, schemas) => {
        if (err) return next(err);
        res.json(schemas);
    };

    glob(path.join(__dirname, `../../../views/schemas/**/*.json`), (err, files) => {
        if (err) return next(err);
        readTemplatesSchemas(files.filter(file => templates ? templates.indexOf(file) !== -1 : true), sendSchemas)
    });
});

function readTemplatesSchemas(files, callback) {
    let schemas = [];
    async.eachSeries(files, (file, callback) => {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) return callback();
                try {
                    schemas.push(JSON.parse(data));
                } catch (e) {
                } finally {
                    callback();
                }
            });
        },
        (err) => {
            callback(err, schemas);
        }
    )
}

module.exports = router;