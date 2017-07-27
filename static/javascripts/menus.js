$(function () {
    var menuTableTemplate;
    var pagination;
    var currentMenus = [];
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
            findMenus(filter, menuTableTemplate, pagination.page || 1);
        });
    }

    $.ajax({
        url: "/api/i18n",
        type: 'GET',
        data: {
            phrases: [
                'Link',
                'Text',
                'Actions',
                'Link can not contain less than 1 characters',
                'Text can not contain less than 2 characters'
            ]
        }
    }).done(function (data) {
        translates = data;
        $.get("/static/handlebars/menus.hbs")
            .done(function (data) {
                menuTableTemplate = Handlebars.compile(data);
                findMenus(filter, menuTableTemplate);
            });
    });

    function findMenus(filter, menuTableTemplate, page) {
        var link = "/api/menu";
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
                    currentMenus = data.docs;
                    $('#menus').replaceWith(menuTableTemplate(data));
                    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
                    $('.tbl-header').css({'padding-right': scrollWidth});
                } else {
                    findMenus(filter, menuTableTemplate, data.page - 1);
                }

            });
    }


    $("body").on("click", "a[data-action=delete-menu-item]", function () {
        var link = $(this).attr('data-self-link');
        $('#confirm-delete').off('click', '#delete');
        $('#confirm-delete').modal()
            .one('click', '#delete', function (e) {
                $.ajax({
                    url: link,
                    type: 'DELETE',
                    success: function (data) {
                        if (data._id) {
                            findMenus(filter, menuTableTemplate, pagination.page);
                        }
                    }
                });
            });
        return false;
    });

    $("a[data-action=add][data-target=menu-item]").click(function () {
        var $modal = $('#add-menu-item');
        var link = "/api/menu";

        $modal.on('hidden.bs.modal', function () {
            $modal.find('.invalid').tooltip('hide');
            $modal.find('.invalid').removeClass('invalid');

        });

        $modal.off('click', '#save');
        $modal.modal()
            .one('click', '#save', function () {
                var newMenuItem = {
                    href: $modal.find('#link').val(),
                    text: $modal.find('#text').val()
                };

                $.ajax({
                    url: link,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(newMenuItem),
                    success: function (data) {
                        console.log('success', data);
                        $modal.find('#link').val('');
                        $modal.find('#text').val('');
                        $modal.modal('hide');
                        if (data._id) {
                            findMenus(filter, menuTableTemplate, pagination.page);
                        }
                    },
                    error: function (err) {
                        console.log(err)
                        if (err.responseJSON.validations !== undefined && err.responseJSON.validations.body !== undefined) {
                            err.responseJSON.validations.body.forEach(function (error) {
                                if (error && error.property === 'request.body.text') {
                                    console.log(error)
                                    $modal.find('#text').addClass('invalid');
                                    $modal.find('#text').attr('title', translates['Text can not contain less than 2 characters'] || 'Text can not contain less than 2 characters');
                                    $modal.find('#text').tooltip('show');
                                }
                                if (error && error.property === 'request.body.href') {
                                    $modal.find('#link').addClass('invalid');
                                    $modal.find('#link').attr('title', translates['Link can not contain less than 1 characters'] || 'Link can not contain less than 1 characters');
                                    $modal.find('#link').tooltip('show');
                                }
                            });
                        }
                    }
                });
            });
        return false;
    });

    $("body").on("keyup", ".invalid", function () {
        $(this).removeClass('invalid');
    });

    $("body").on("click", "a[data-action=save-menu-item]", function () {
        var link = $(this).attr('data-self-link');
        var id = $(this).attr('data-id');

        var selectedMenu = currentMenus.find(function (item) {
            return item._id === id;
        });

        if (!selectedMenu) {
            alert('Menu item with id = [' + id + '] does not exists');
            return;
        }
        selectedMenu.href = $('#' + id + ' [name=href]').val();
        selectedMenu.text = $('#' + id + ' [name=text]').val();

        var $modal =  $('#confirm-save').modal();

        $modal.off('click', '#save');
        $modal
            .one('click', '#save', function () {
                console.log('hello')
                $.ajax({
                    url: link,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(selectedMenu),
                    success: function (data) {
                        console.log('success', data)
                        if (data._id) {
                            findMenus(filter, menuTableTemplate, pagination.page);
                        }
                    },
                    error: function (err) {
                        if (err.responseJSON.validations !== undefined && err.responseJSON.validations.body !== undefined) {
                            err.responseJSON.validations.body.forEach(function (error) {
                                if (error && error.property === 'request.body.text') {
                                    console.log(error)
                                    $('#' + id + ' [name=text]').addClass('invalid');
                                    $('#' + id + ' [name=text]').attr('title', translates['Text can not contain less than 2 characters'] || 'Text can not contain less than 2 characters');
                                    $('#' + id + ' [name=text]').tooltip('show');
                                }
                                if (error && error.property === 'request.body.href') {
                                    $('#' + id + ' [name=href]').addClass('invalid');
                                    $('#' + id + ' [name=href]').attr('title', translates['Link can not contain less than 1 characters'] || 'Link can not contain less than 1 characters');
                                    $('#' + id + ' [name=href]').tooltip('show');
                                }
                            });
                        }
                    }
                });
            });
        return false;
    });

    var socket = io("/admin");

    socket.on('menu/new', function () {
        findMenus(filter, menuTableTemplate, pagination.page);
    });
});


