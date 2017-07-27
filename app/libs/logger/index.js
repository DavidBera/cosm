const
    winston = require('winston'),
    env = process.env.NODE_ENV;

function getLogger(module) {
    let path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (env == 'development') ? 'debug' : 'error',
                label: path
            }),
            new winston.transports.File({
                filename: (env == 'development') ? 'log/fileLog-debug.log' : 'log/fileLog-error.log',
                level: (env == 'development') ? 'debug' : 'error'
            }),
        ]
    });
}

module.exports = getLogger;
