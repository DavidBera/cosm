$(function () {
    var feedbackInfoTemplate;
    var feedbacksTableTemplate;
    var pagination;
    var currentFeedbackId;
    var filter = null;

    var translates = {};

    Handlebars.registerHelper('__', function (v1) {
        var translate = translates[v1];
        if (translate) {
            return translate;
        }
        loadTranslates([v1]);
    });

    function loadTranslates(phrases, callback) {
        $.ajax({
            url: "/api/i18n",
            type: 'GET',
            data: {
                phrases: phrases
            }
        }).done(function (data) {
            translates = Object.assign(translates, data);
            findFeedbacks(filter, menuTableTemplate, pagination.page || 1);
        });
    }

    $.ajax({
        url: "/api/i18n",
        type: 'GET',
        data: {
            phrases: [
                'Name',
                'Email',
                'Message',
                'Actions',
                'Message status'
            ]
        }
    }).done(function (data) {
        translates = data;
        $.get("/static/handlebars/feedbacks.hbs")
            .done(function (data) {
                feedbacksTableTemplate = Handlebars.compile(data);
                findFeedbacks(filter, feedbacksTableTemplate);
            });
    });

    $('a[data-target=feedbacks][data-action=find-new]').click(function () {
        filter = {
            status: "NEW"
        };
        findFeedbacks(filter, feedbacksTableTemplate, pagination.page);
    });

    $('a[data-target=feedbacks][data-action=find-all]').click(function () {
        filter = {
        };
        findFeedbacks(filter, feedbacksTableTemplate, pagination.page);
    });

    function findFeedbacks(filter, feedbacksTableTemplate, page) {
        var link = "/api/feedbacks";
        if (page) link = link + "?page=" + page;
        $.get(link, filter)
            .done(function (data) {
                pagination = {
                    total: data.total,
                    limit: data.limit,
                    page: data.page,
                    pages: data.pages
                };
                if ((data.docs && data.docs.length > 0) || data.page === 1) {
                    $('#feedbacks').replaceWith(feedbacksTableTemplate(data));
                    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
                    $('.tbl-header').css({'padding-right': scrollWidth});
                } else {
                    findFeedbacks(filter, feedbacksTableTemplate, data.page - 1);
                }

            });
    }

    $("body").on("click", "a[data-action=open-feedback]", function () {
        var link = $(this).attr('data-self-link');
        var id = $(this).attr('data-id');
        var status = $(this).attr('data-status');
        var feedbackFunction = openFeedback;
        if (status == "NEW") {
            feedbackFunction = viewFeedback;
        }
        if (feedbackInfoTemplate) {
            feedbackFunction(link, id, feedbackInfoTemplate);
        } else {
            $.get("/static/handlebars/feedback-info.hbs")
                .done(function (data) {
                    feedbackInfoTemplate = Handlebars.compile(data);
                    feedbackFunction(link, id, feedbackInfoTemplate);
                });
        }
        return false;
    });

    $("body").on("click", "a[data-action=delete-feedback]", function () {
        var link = $(this).attr('data-self-link');
        var $modal = $('#confirm-delete').modal();

        $modal.off('click', '#delete');

        $modal
            .one('click', '#delete', function (e) {
                $.ajax({
                    url: link,
                    type: 'DELETE',
                    success: function (data) {
                        if (data._id) {
                            findFeedbacks(filter, feedbacksTableTemplate, pagination.page);
                        }
                    }
                });
            });
        return false;
    });


    $("body").on("click", "a[data-target=page][data-action=select]", function () {
        var page = $(this).attr('data-page');
        $.get("/api/feedbacks?page=" + page, filter)
            .done(function (data) {
                pagination = {
                    total: data.total,
                    limit: data.limit,
                    page: data.page,
                    pages: data.pages
                };
                $('#feedbacks').replaceWith(feedbacksTableTemplate(data));
            });
        return false;
    });

    $("body").on("click", "a[data-target=page][data-action=find-first]", function () {
        $.get("/api/feedbacks?page=" + 0, filter)
            .done(function (data) {
                pagination = {
                    total: data.total,
                    limit: data.limit,
                    page: data.page,
                    pages: data.pages
                };
                $('#feedbacks').replaceWith(feedbacksTableTemplate(data));
            });
        return false;
    });

    $("body").on("click", "a[data-target=page][data-action=find-last]", function () {
        var lastPage = pagination.pages;
        $.get("/api/feedbacks?page=" + lastPage, filter)
            .done(function (data) {
                pagination = {
                    total: data.total,
                    limit: data.limit,
                    page: data.page,
                    pages: data.pages
                };
                $('#feedbacks').replaceWith(feedbacksTableTemplate(data));
            });
        return false;
    });

    function viewFeedback(link, id, template) {
        $('#feedback-info').remove();
        if (id !== currentFeedbackId) {
            $.post(link + "/view")
                .done(function (data) {
                    $('#' + id).after(template(data));
                    $('#' + id).addClass("active");
                });
            currentFeedbackId = id;
        } else {
            currentFeedbackId = null;
        }
    }

    function openFeedback(link, id, template) {
        $('#feedback-info').remove();
        $('tr.bg-grey').removeClass('bg-grey');
        $('tr > td.bg-grey').removeClass('bg-grey');
        if (id !== currentFeedbackId) {
            $.get(link)
                .done(function (data) {
                    $('#' + id).after(template(data));
                    $('#' + id).addClass('bg-grey');
                    $('#' + id + ' td').addClass('bg-grey');
                });
            currentFeedbackId = id;
        } else {
            currentFeedbackId = null;
        }
    }

    var socket = io("/admin");

    socket.on('feedbacks/new', function () {
        findFeedbacks(filter, feedbacksTableTemplate, pagination.page);
    });
});


