const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const locale = require('connect-locale');
const i18n = require('i18n');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const uglifyMiddleware = require('express-uglify-middleware');
const nodeSassMiddleware = require('node-sass-middleware');
const vhost = require('vhost');
const compression = require('compression');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const errors = require('./app/errors');

const path = require('path');
const fs = require('fs');
const util = require('util');
const FileStreamRotator = require('file-stream-rotator');
const routes = require('./app/routes');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const config = require('./config');

const hbs = require('./app/libs/customHbs');
const log = require('./app/libs/logger')(module);

//database creation script
require('./createDB');

//start nodejs server
let port = config.get('NODE_PORT');
server.listen(port, config.get('NODE_IP'), function () {
    log.info('Application worker ' + process.pid + ' started...');
});
server.on('error', onError);
server.on('listening', onListening);

//setup template engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');
app.set('json spaces', 40);

let logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: true
});

// if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use((process.env.NODE_ENV == 'development') ? logger('dev') : logger('common', {stream: accessLogStream}));
// }



app.use(function (req, res, next) {
    let path = require('url').parse(req.url, true);
    req.fullUrl = req.protocol + '://' + req.get('host') + path.pathname;
    next();
});

app.use(compression());
app.use(nodeSassMiddleware({
    src: path.join(__dirname, 'static/sass')
    , dest: path.join(__dirname, 'static/public/css')
    , prefix: '/static/css'
    , outputStyle: 'compressed'
    , force: (process.env.NODE_ENV == 'development') ? true : false
    , debug: (process.env.NODE_ENV == 'development') ? true : false
    , maxAge: (process.env.NODE_ENV == 'development') ? 0 : 2629000
}));

app.use(uglifyMiddleware({
    src: __dirname + "/static/javascripts"
    , dest: __dirname + '/static/public/javascripts/min'
    , prefix: "/static/javascripts/min"
    , compressFilter: /\.js$/
    , compress: true
    , force: (process.env.NODE_ENV == 'development') ? true : false
    , debug: (process.env.NODE_ENV == 'development') ? true : false
    , maxAge: (process.env.NODE_ENV == 'development') ? 0 : 2629000
}));

app.use('/static', express.static(path.join(__dirname, 'static/public'),
    (process.env.NODE_ENV == 'development') ? null : {maxAge: 2592000000})
);

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(bodyParser.json({limit: '120mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '120mb'}));
app.use(cookieParser());

i18n.configure(Object.assign({register: global}, config.get('i18n')));
app.use(i18n.init);

let sessionConfig = config.get('session');
sessionConfig.store = new MongoStore({mongooseConnection: mongoose.connection});
app.use(session(sessionConfig));
app.use(function (req, res, next) {
    res.locals.lang = req.getLocale();
    next();
});
app.use(function (req, res, next) {
    let lang = req.query.lang;
    if (lang) {
        res.cookie(config.get('i18n:cookie'), lang, {httpOnly: true});
        let path = req.originalUrl.slice(0, req.originalUrl.indexOf("?"));
        return res.redirect(path);
    }
    next();
});

app.use(require('./app/middleware/loadUser'));

io.use(function (socket, next) {
    app.sessionMiddleware(socket.request, socket.request.res, next);
});

io.use(function (socket, next) {
    require('./app/middleware/loadUser')(socket.request, socket.request.res, next);
});

io.of('/auth').on('connection', function (socket) {
    if (!socket.request.user) {
        socket.disconnect();
        return;
    }

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

io.of('/admin').on('connection', function (socket) {
    if (!socket.request.user) {
        socket.disconnect();
        return;
    }

    if (socket.request.user.role != 'admin') {
        socket.disconnect();
        return;
    }

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

app.use(function (req, res, next) {
    req.io = io;
    next();
});

//router
app.use(routes);

//errors handlers
app.use(errors.validationError);
app.use(errors.notFoundErrorHandler);
app.use(errors.errorHandler);
app.sessionMiddleware = session(sessionConfig);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            log.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    log.info('Listening on ' + bind);
}

module.exports = app;
