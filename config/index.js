const
    path = require('path'),
    nconf = require('nconf');

nconf.argv()
    .env()
    .file({file: path.join(__dirname, detectEnvironment() === 'test' ? 'test.json' : 'config.json')});

function isRunningAsTestSuite() {
    return require.main && exports.main !== undefined && (require.main.filename != path.resolve(exports.main));
}

function detectEnvironment() {
    if (process.env.NODE_ENV) return process.env.NODE_ENV;
    if (isRunningAsTestSuite()) {
        return 'test';
    } else {
        return 'development';
    }
}

module.exports = nconf;
