const MAX_PER_PAGE = 1000;

function loadPagination(req, res, next) {
    let perPage = +req.query.perPage;
    if (perPage > MAX_PER_PAGE) perPage = MAX_PER_PAGE;
    req.pagination = {
        limit: perPage || perPage >= 0 ? perPage : 20,
        page: +req.query.page || 1,
        sort: req.query.sort
    };

    if (req.pagination.page < 1) {
        req.pagination.page = 1;
    }
    return next();
}

exports.loadPagination = loadPagination;