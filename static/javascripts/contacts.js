$(function () {
    $('body').on("click", ".invalid-field", function () {
        $('.invalid-field-message').each(function () {
            console.log(this);
            $(this).removeClass('invalid-field-message');
        });
    });

    $("#sendFeedback").click(function () {
        var feedbackForm = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val() === '' ? null : $("#phone").val(),
            message: $("#message").val(),
        };
        $.ajax({
            url: '/api/feedbacks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(feedbackForm)
        }).done(function () {
            resetInvalidFields('name', 'email', 'phone', 'message');
            $("#feedback-form")[0].reset();
            iziToast.show({
                // icon: 'fa fa-comments-o',
                class: 'ell-toast',
                title: "Спасибо за отзыв",
                message: "Мы с вами свяжемся",
                position: 'bottomRight',
                progressBar: false,
                // progressBarColor: 'rgb(0, 255, 184)',
                layout: 2,
                resetOnHover: true,
                animateInside: false,
                // buttons: [
                //     ['<button>Open</button>', function (instance, toast) {
                //         alert("Opening!");
                //     }],
                // ]
            });
        }).fail(function (err) {
            console.log('%cBad request, you can see error below', "color: white; background-color: red;", err);
            console.log('%cError object: ', "color: white; background-color: red;", err.responseJSON);
            if (err.responseJSON.validations !== undefined && err.responseJSON.validations.body !== undefined) {
                err.responseJSON.validations.body.forEach(function (error) {
                    setInvalidFields(error.property.replace('request.body.', ''));
                });
            }
        });
        return false;
    });

    resetInvalidFieldsOnKeyup('name', 'email', 'phone', 'message');

    function resetInvalidFieldsOnKeyup() {
        Array.from(arguments).forEach(function (argument) {
            if (Array.isArray(argument)) {
                argument.forEach(function (field) {
                    $("#" + filed).keyup(function () {
                        $(this).removeClass("invalid-field");
                    });
                });
            } else {
                $("#" + argument).keyup(function () {
                    $(this).removeClass("invalid-field");
                });
            }
        });
    }

    function setInvalidFields() {
        Array.from(arguments).forEach(function (argument) {
            if (Array.isArray(argument)) {
                argument.forEach(function (field) {
                    $('#' + field).addClass("invalid-field invalid-field-message");
                });
            } else {
                $('#' + argument).addClass("invalid-field invalid-field-message");
            }

        });
    }

    function resetInvalidFields() {
        Array.from(arguments).forEach(function (argument) {
            if (Array.isArray(argument)) {
                argument.forEach(function (field) {
                    $('#' + field).removeClass("invalid-field");
                });
            } else {
                $('#' + argument).removeClass("invalid-field");
            }
        });
    }

    function initMap() {

        var lat = $('#map').data('lat');
        var lng = $('#map').data('lng');
        var markerImage = $('#map').data('markerIcon');

        var location = new google.maps.LatLng(lat, lng);
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location,
            zoom: 12,
            panControl: false,
            streetViewControl: false,
            scaleControl: true,
            scrollwheel: false,
            // draggable: false,
            overviewMapControl: true
//                mapTypeId: google.maps.MapTypeId.ROADMAP,
//                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        };

        var map = new google.maps.Map(mapCanvas, mapOptions);

        var styles = [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#6195a0"}]
        }, {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{"lightness": "0"}, {"saturation": "0"}, {"color": "#f5f5f2"}, {"gamma": "1"}]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [{"lightness": "-3"}, {"gamma": "1.00"}]
        }, {
            "featureType": "landscape.natural.terrain",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#bae5ce"}, {"visibility": "on"}]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}, {"visibility": "simplified"}]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#fac9a9"}, {"visibility": "simplified"}]
        }, {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [{"color": "#4e4e4e"}]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#787878"}]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
        }, {
            "featureType": "transit.station.airport",
            "elementType": "labels.icon",
            "stylers": [{"hue": "#0a00ff"}, {"saturation": "-77"}, {"gamma": "0.57"}, {"lightness": "0"}]
        }, {
            "featureType": "transit.station.rail",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#43321e"}]
        }, {
            "featureType": "transit.station.rail",
            "elementType": "labels.icon",
            "stylers": [{"hue": "#ff6c00"}, {"lightness": "4"}, {"gamma": "0.75"}, {"saturation": "-68"}]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#eaf6f8"}, {"visibility": "on"}]
        }, {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#c7eced"}]
        }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"lightness": "-49"}, {"saturation": "-53"}, {"gamma": "0.79"}]
        }];

        map.set('styles', styles);

        // var markerImage = new google.maps.Marker({
        //     position: location,
        //     map: map
        // });

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: markerImage
        });

        var contentString = '<div class="info-window">' +
            '<h3 style="color: #333; text-align: left">COSM</h3>' +
            '<div class="info-content">' +
            '<p style="color: #333;">7A Prospekt Rechitsky Gomel, Belarus</p>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 400
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }

    google.maps.event.addDomListener(window, 'load', initMap);
});
