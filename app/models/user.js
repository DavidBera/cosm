var crypto = require('crypto');
var async = require('async');
var errors = require('../errors/index');

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    role: {
        type: String,
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function (login, password, callback) {
    var User = this;
    async.waterfall([
        function (callback) {
            User.findOne({login: login}, callback);
        },
        function (user, callback) {
            if (!user || !user.checkPassword(password)) {
                return callback(new errors.AuthError('Login or password are incorrect'));
            } else {
                callback(null, user);
            }
        }
    ], callback);
}

exports.User = mongoose.model('User', schema);
