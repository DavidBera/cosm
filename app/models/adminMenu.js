const
    mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var menu = new Schema({
    href: String,
    class: String,
    text: {
        type: String,
        required: true
    }
});
menu.add({children: [menu]});

var menuSection = new Schema({
    text: {
        type: String,
        required: true
    }
});
menuSection.add({menus: [menu]});

exports.AdminMenuSection = mongoose.model('AdminMenuSection', menuSection);
