function loadFilter(req, res, next) {
    let filter = Object.assign({}, req.query);
    delete filter.perPage;
    delete filter.page;
    req.filter = filter;
    return next();
}

exports.loadFilter = loadFilter;