const
    mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
            'Please fill a valid phone number']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    message: {
        type: String,
        trim: true,
        required: 'Message is required'
    },
    status: {
        type: String,
        required: true,
    },
    isImportant: {
        type: Boolean
    },
    __v: {type: Number, select: false}
}, {
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            delete ret.id;
        }
    }
});

schema.virtual('shortMessage').get(function () {
    if (!this.message) {
        return null;
    }
    if (this.message.length < 30) {
        return this.message;
    }
    return this.message.slice(0, 30) + '...';
});

exports.Feedback = mongoose.model("Feedback", schema);