function addLinks(obj, req) {
    let result = typeof obj.toObject === "function" ? obj.toObject() : obj;
    if (result && result._id) {
        result._links = {
            self: req.fullUrl + "/" + result._id
        };
    }
    return result;
}

exports.addLinks = addLinks;
