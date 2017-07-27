module.exports = {
    type: Object,
    properties: {
        name: {
            id: "name",
            type: String,
            required: true,
            minLength: 2,
        },
        phone: {
            id: "phone",
            type: String,
            pattern: "^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$"
        },
        email: {
            id: "email",
            type: String,
            required: true,
            pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
        },
        message: {
            id: "message",
            type: String,
            required: true,
            minLength: 10
        }
    }
};