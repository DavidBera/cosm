$(function () {
    var strings = [
        'Данные, к которым вы хотите получить доступ, засекречены!',
        'Дальнейшие действия могут нанести непоправивый вред вашему компьютеру.',
        'Наша организация заботится о недоступности конфеденциальных данных, о защите своих ресурсов и программного обеспечения.',
        'Если вы все-таки решитесь продолжить, помните - мы вас предупреждали!',
        'Но если же вы программист и программируете на Perl, свяжитесь с нами по телефону +375 29 654 53 43, возможно у нас найдется для вас работа.',
        'Перейдем к делу: вы хотите продолжить?',
        'y - продолжить, любое другое значение - вернуться на главную страницу'
    ];
    var statusCode = $('#statusCode').text();

    if (statusCode == '403') {
        $('body').append('<div class="blackWindow"><div class="container"><div class="glitch" data-text="> ">> </div>' +
            '</div></div>');
        var time = 0;
        strings.forEach(function (string, index) {
            var chars = [];
            for (var i = 0, len = string.length; i < len; i++) {
                chars.push(string[i]);
            }
            chars.forEach(function (char) {
                time = time + Math.round(Math.random() * 3) * 50;
                setTimeout(function () {
                    $('.glitch').last().append(char);
                    $('.glitch').last().attr('data-text', $('.glitch').last().attr('data-text') + char);
                }, time);
            });
            if (index != strings.length - 1) {
                setTimeout(function () {
                    time = time + 500;
                    $('.glitch').last().after('<div class="glitch" data-text="> ">> </div>');
                }, time);
            }
        });
        setTimeout(function () {
            time = time + 500;
            $('.glitch').last().after('> <input id="answer" type="text"/>');
            $("#answer").focus();
        }, time);

    }

    $('body').on('click', '.blackWindow', function (e) {
        $('#answer').focus();
    })

    $('body').on('keypress', '#answer', function (e) {
        if (e.keyCode == 13) {
            if ($('#answer').val() == 'y') {
                $('.blackWindow').fadeOut(400, function () {
                    $('.blackWindow').remove();
                });
            } else {
                window.location.replace('/');
            }
        }
    });
})


