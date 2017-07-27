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
        // required: true
    },
    sections: [],
    scripts: [String],
    __v: {type: Number, select: false}
});

schema.virtual('link')
    .set(function (url) {
        this.url = url;
    })
    .get(function () {
        if(this.url) return this.url;
        return '/' + this.name;
    });

exports.Page = mongoose.model('Page', schema);