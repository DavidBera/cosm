const
    mongoose = require('mongoose'),
    config = require('../../../config'),
    mongoosePaginate = require('mongoose-paginate');


var connection_string = config.get('mongoose:uri');

mongoosePaginate.paginate.options = {
    lean: true,
    limit: 20,
    leanWithId: false
};
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connection_string, config.get('mongoose:options'));
mongoose.plugin(mongoosePaginate);


module.exports = mongoose;