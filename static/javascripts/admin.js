var FeedbackState = (function () {
    var instance;

    return function getInstance() {
        var feedbacksCount = 0;

        this.addToCount = function (count) {
            feedbacksCount += count;
            $('#user-profile').addClass('has-new-items');
            $('#user-profile__feedbacks .badge').text(feedbacksCount);
        };

        this.subtractFromCount = function (count) {
            feedbacksCount -= count;
            console.log(feedbacksCount);
            if (feedbacksCount > 0) {
                $('#user-profile').addClass('has-new-items');
                $('#user-profile__feedbacks .badge').text(feedbacksCount);
            } else {
                $('#user-profile').removeClass('has-new-items');
                $('#user-profile__feedbacks .badge').text('');
            }
        };

        this.resetCount = function () {
            feedbacksCount = 0;
            $('#user-profile').removeClass('has-new-items');
            $('#user-profile__feedbacks .badge').text("");
        };

        this.getState = function () {
            return {
                feedbacksCount: feedbacksCount
            }
        };

        if (instance) {
            return instance;
        }
        if (this && this.constructor === getInstance) {
            instance = this;
        } else {
            return new getInstance();
        }
    }
})();

function notify(title, message, callback) {
    iziToast.show({
        color: 'dark',
        backgroundColor: 'RGB(42,63,84)',
        icon: 'fa fa-comments-o',
        title: title,
        message: message,
        position: 'bottomRight',
        // progressBar: false,
        // progressBarColor: 'rgb(0, 255, 184)',
        layout: 1,
        resetOnHover: true,
        animateInside: false,

        buttons: [
            ['<button>Open</button>', callback],
        ]
    });
}

var socket = io("/admin");
socket.on('hello', function (data) {
    console.log(data);
});
socket.on('for user', function (data) {
    console.log(">>>>", data);
});

socket.on('feedbacks/new', function (data) {
    FeedbackState().addToCount(1);
    console.log(data);
    notify(data.email, data.shortMessage, function () {
        window.location.href = data._links.self;
    });
});

socket.on('feedbacks/viewed', function (data) {
    FeedbackState().subtractFromCount(1);
});

$(function () {
    $.get("/api/feedbacks/status/new/count")
        .done(function (data) {
            console.log(FeedbackState());
            FeedbackState().addToCount(data.count);
        });

    $('#user-profile__feedbacks a').click(function (event) {
        event.preventDefault();
        FeedbackState().resetCount();
        notify("Welcome", "How are you?");
    });

    function testAnim(x) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog  ' + x + '  animated');
    };

    $('.modal').on('show.bs.modal', function (e) {
        testAnim('fadeIn');
    });

    $('.modal').on('hide.bs.modal', function (e) {
        testAnim('fadeOut');
    });

    $.ajax({
        url: "/static/handlebars/pagination.hbs",
        async: false
    }).done(function (data) {
        Handlebars.registerPartial("pagination", data);
    });
});


Handlebars.registerHelper('times', function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('is_last_page', function (value, opts) {
    if (value.page + 1 == value.totalPages) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('pagination', function (currentPage, totalPage, size, options) {
    var startPage, endPage, context;

    if (arguments.length === 3) {
        options = size;
        size = 5;
    }

    startPage = currentPage - Math.floor(size / 2);
    endPage = currentPage + Math.floor(size / 2);

    if (startPage <= 0) {
        endPage -= (startPage - 1);
        startPage = 1;
    }

    if (endPage > totalPage) {
        endPage = totalPage;
        if (endPage - size + 1 > 0) {
            startPage = endPage - size + 1;
        } else {
            startPage = 1;
        }
    }

    context = {
        startFromFirstPage: false,
        pages: [],
        endAtLastPage: false,
    };
    if (startPage === 1) {
        context.startFromFirstPage = true;
    }
    for (var i = startPage; i <= endPage; i++) {
        context.pages.push({
            page: i,
            pageNum: i,
            isCurrent: i === currentPage,
        });
    }
    if (endPage === totalPage) {
        context.endAtLastPage = true;
    }

    return options.fn(context);
});

