module.exports = {
    type: Object,
    properties: {
        href: {
            id: "href",
            type: String,
            required: true,
            minLength: 1,
        },
        text: {
            id: "text",
            type: String,
            required: true,
            minLength: 2,
        }
    }
};