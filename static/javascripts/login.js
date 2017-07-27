$(function () {
    $(".input").focusin(function () {
        $(this).find("span").animate({"opacity": "0"}, 200);
    });

    $(".input").focusout(function () {
        $(this).find("span").animate({"opacity": "1"}, 300);
    });

    $(".login").submit(function () {
        $(this).find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color": "#fff"});
        $(".submit").css({"background": "#2ecc71", "border-color": "#2ecc71"});
        $(".feedback").html("Please wait...");
        $(".feedback").show().animate({"opacity": "1", "bottom": "-65px"}, 400);
        $("input").css({"border-color": "#2ecc71"});

        var frm = $("#loginForm");
        var data = JSON.stringify(frm.serializeArray());
        console.log(data);
        console.log(window.location);
        $.ajax({
            url: window.location.pathname + window.location.search,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                login: $('input[name=login]').val(),
                password: $('input[name=password]').val(),
            }),
        }).done(function(data) {
            console.log($("#loginForm").serialize());
            console.log(data);
            $(this).find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color": "#fff"});
            $(".submit").css({"background": "#2ecc71", "border-color": "#2ecc71"});
            $(".feedback").html("Login successful");
            $(".feedback").removeClass("error");
            $(".feedback").show().animate({"opacity": "1", "bottom": "-65px"}, 400);
            $("input").css({"border-color": "#2ecc71"});
            var initWidth = 0;
            setInterval(function () {
                $('.load').css({width: (++initWidth) + '%'})
            },5);
            setTimeout(function () {
                window.location.replace(data.redirectUrl);
            }, 500);
        }).fail(function (data) {
            console.log($("#loginForm").serialize());
            console.log(data);
            $(this).find(".submit i").removeAttr('class').addClass("fa fa-sign-in").css({"color": "#fff"});
            $(".submit").css({"background": "#dc4f48", "border-color": "#dc4f48"});
            $(".feedback").html("Login failed...");
            $(".feedback").addClass("error");
            $(".feedback").show().animate({"opacity": "1", "bottom": "-65px"}, 400);
            $("input").css({"border-color": "#dc4f48"});
            console.log(data.status);
            console.log(data.responseJSON);
        }).always(function () {
            console.log('finish')
        });

        return false;
    });
})

