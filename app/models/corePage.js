var
    mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    url: {
        type: String
    },
    head: {
        styles: [String],
        scripts:[String],
        title: {
            type: String,
            required: true
        },
        meta: [],
    },
    sections: [],
    scripts: [String]

});

exports.CorePage = mongoose.model('CorePage', schema);