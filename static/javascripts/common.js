(function ($) {
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1000, 'easeInOutCubic');
        // $('html, body').animate({scrollTop:($($anchor.attr('href')).offset().top - 50)}, 700);
        event.preventDefault();

    });

    $('a.page-scroll').click(function () {
        $('html, body').animate({scrollTop: $('#elementId').position().top}, 2000);
    });

    // Highlight the top nav as scrolling occurs
    // $('body').scrollspy({
    //     target: '.navbar-fixed-top',
    //     offset: 100
    // });

    // $('body').scrollspy({
    //     target: '.navbar-fixed-top',
    //     offset: 4000
    // });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function () {
        if (!$(this).hasClass("dropdown-toggle")) {
            $('.navbar-toggle:visible').click();
        }
    });

    $('.dropdown').on('show.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).slideToggle(200);
    });

    // Add slideUp animation to Bootstrap dropdown when collapsing.
    $('.dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).slideToggle(200);
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 50
        }
    });

    $('header nav').affix({
        offset: {
            top: 100
        }
    });

    $('header .heading').affix({
        offset: {
            top: 100
        }
    });

    $(document).ready(function () {
        var even = true;
        $('.anim').each(function () {

            $(this).viewportChecker({
                classToAdd: 'animated ' + (even ? 'fadeInRight' : 'fadeInLeft') + ' vis',
                offset: 15
            });
            even = !even;
        });
        jQuery('.row').each(function () {
            var items = $($(this).find('.item'));
            var l = items.length;
            if (items.length > 0) {
                console.log('item ' + Math.floor(l / 2));
                for (var i = 0; i < l; i++) {
                    if (i < Math.floor(l / 2)) {
                        $(items[i]).viewportChecker({
                            classToAdd: 'animated fadeInLeft vis',
                            offset: 5
                        });
                    }
                    if (i == Math.floor(l / 2)) {
                        if (l % 2 == 0) {
                            $(items[i]).viewportChecker({
                                classToAdd: 'animated fadeInRight vis',
                                offset: 5
                            });
                        } else {
                            $(items[i]).viewportChecker({
                                classToAdd: 'animated fadeInUp vis',
                                offset: 5
                            });
                        }
                    }
                    if (i > Math.floor(l / 2)) {
                        $(items[i]).viewportChecker({
                            classToAdd: 'animated fadeInRight vis',
                            offset: 5
                        });
                    }
                }
            }
        });

        jQuery('.row').each(function () {
            var items = $($(this).find('.dev-item'));
            var l = items.length;
            if (items.length > 0) {
                console.log('item ' + Math.floor(l / 2));
                for (var i = 0; i < l; i++) {
                    $(items[i]).viewportChecker({
                        classToAdd: 'animated flipInY vis',
                        offset: 5
                    });
                }
            }
        });

        // $("[data-type='parallax']").viewportChecker({
        //     offset: 0,
        //     repeat: true,
        //     callbackFunction: function (elem, action) {
        //         if (elem.attr('data-top') === undefined) {
        //             elem.attr('data-top', elem.offset().top);
        //         }
        //         var elemTop = elem.attr('data-top');
        //         var depth = elem.attr('data-depth');
        //         //
        //         // console.log('blabla ' + (window.scrollY - elemTop));
        //         var movement = window.scrollY - elemTop;
        //         var translate3d = 'translate3d(0, ' + movement * depth + 'px, 0)';
        //         elem.css({transform: translate3d});
        //     },
        //     scrollHorizontal: false
        // });
    });

})(jQuery);

SmoothScroll({
    animationTime: 400,
    stepSize: 60,
    keyboardSupport: true
});

// $('body').on("mousewheel", function () {
//     event.preventDefault();
//
//     var wheelDelta = event.wheelDelta;
//
//     var currentScrollPosition = window.pageYOffset;
//     window.scrollTo(0, currentScrollPosition - wheelDelta);
// });
//
// var socket = io("/admin");
// socket.on('hello', function (data) {
//     console.log(data);
// });