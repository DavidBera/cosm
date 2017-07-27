tinymce.init({
    selector: 'textarea#tiny',
    height: 380,
    theme: 'modern',
    language_url : '/static/admin/build/js/tiny/langs/ru.js',
    resize: false,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
    ],
    toolbar1: 'undo redo searchreplace | insert | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media',
    toolbar2: 'styleselect | fontselect | bold italic removeformat | forecolor backcolor | cut copy paste | visualblocks wordcount fullscreen preview code',
    image_advtab: true,
    content_css: [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
        "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic",
        "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css",
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/themes/orange/pace-theme-minimal.min.css",
        "/static/css/main-style.css",
        // "/static/css/tiny.css",
    ]
});