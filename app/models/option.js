const
    mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    value: String
});

exports.Option = mongoose.model('Option', schema);

