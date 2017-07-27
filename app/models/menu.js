const
    mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    href: String,
    text: String,
    __v: {type: Number, select: false}
});

exports.Menu = mongoose.model('Menu', schema);
