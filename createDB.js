const
    mongoose = require('./app/libs/mongoose'),
    async = require('async'),
    config = require('./config');

mongoose.set('debug', false);

async.series([
        open,
        dropDatabase,
        requireModels,
        createOptions,
        createMenu,
        createAdminMenu,
        createUsers,
        createAdminPages,
        createPages,
        createFeedback,
        loadOptions,
    ], function (err, res) {
        console.log(err);
    }
);

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    let db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./app/models/user');
    require('./app/models/page');
    require('./app/models/menu');
    require('./app/models/option');
    require('./app/models/corePage');
    require('./app/models/feedback');
    require('./app/models/adminMenu');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createFeedback(callback) {
    let feedbacks = [{
        name: 'system',
        email: 'system@system.com',
        message: 'welcome to system',
        status: 'NEW',
        isImportant: true
    }];

    async.each(feedbacks, function (item, callback) {
        let feedback = new mongoose.models.Feedback(item);
        feedback.save(function (err) {
            callback(err, feedback);
        })
    }, callback);
}

function createUsers(callback) {
    let users = [
        {
            login: 'admin',
            email: 'admin@mail.ru',
            role: 'admin',
            password: 'pass'
        },
        {
            login: 'egor',
            email: 'egor@mail.ru',
            role: 'user',
            password: 'egor'
        },
    ]

    async.each(users, function (item, callback) {
        let user = new mongoose.models.User(item);
        user.save(function (err) {
            callback(err, user);
        })
    }, callback);
}

function createAdminMenu(callback) {
    let menuItems = [
        {
            text: 'Content options',
            menus: [
                {
                    href: "/",
                    text: "Home",
                    class: "fa fa-home"
                },
                {
                    text: "Pages",
                    class: "fa fa-clone",
                    children: [
                        {
                            href: "/admin/pages/new",
                            text: "Create new",
                        },
                        {
                            href: "/admin/pages",
                            text: "All pages",
                        },
                    ]
                },
                {
                    text: "Feedback",
                    class: "fa fa-comments-o",
                    children: [
                        {
                            href: "/admin/feedbacks",
                            text: "List of feedback",
                        },
                    ]
                },
                {
                    text: "Menu",
                    class: "fa fa-list-ul",
                    children: [
                        {
                            href: "/admin/menus",
                            text: "Menu items",
                        },
                    ]
                },
                // {
                //     text: "Записи",
                //     class: "fa fa-thumb-tack",
                //     children: [
                //         {
                //             href: "#",
                //             text: "Добавить запись",
                //         },
                //         {
                //             href: "#",
                //             text: "Все записи",
                //         },
                //     ]
                // },
                // {
                //     text: "Категории",
                //     class: "fa fa-link",
                //     children: [
                //         {
                //             href: "#",
                //             text: "Добавить категорию",
                //         },
                //         {
                //             href: "#",
                //             text: "Все категории",
                //         },
                //     ]
                // },
            ]
        },
        {
            text: 'Site options',
            menus: [
                {
                    text: "Options",
                    class: "fa fa-sliders",
                    children: [
                        {
                            href: "/admin/site-options",
                            text: "Site options",
                        },
                        {
                            href: "/admin/server-options",
                            text: "Server options",
                        },
                    ]
                }
            ]
        }
    ];

    async.eachSeries(menuItems, function (item, callback) {
        let adminMenu = new mongoose.models.AdminMenuSection(item);
        adminMenu.save(function (err) {
            callback(err, adminMenu);
        })
    }, callback);
}

function createMenu(callback) {
    let menuItems = [
        {
            href: "/",
            text: "Main",
            active: false
        },
        {
            href: "/about",
            text: "About us",
            active: false
        },
        {
            href: "/solutions",
            text: "Solutions",
            active: false
        },
        {
            href: "/contacts",
            text: "Contacts",
            active: false
        }
    ];

    async.eachSeries(menuItems, function (item, callback) {
        let menu = new mongoose.models.Menu(item);
        menu.save(function (err) {
            callback(err, menu);
        })
    }, callback);
}

function createOptions(callback) {
    let options = [
        {
            name: "mainPage",
            value: "main",
        }
    ];

    async.eachSeries(options, function (item, callback) {
        let option = new mongoose.models.Option(item);
        option.save(function (err) {
            callback(err, option);
        })
    }, callback);
}

function loadOptions(callback) {
    mongoose.models.Option.find({}, function (err, data) {
        data.forEach(function (item) {
            config.set('app:options:' + item.name, item.value);
        });
        callback();
    });
}

function createAdminPages(callback) {
    let pages = [
        {
            name: 'error',
            head: {
                styles: ["/static/css/main-style.css", "/static/css/error.css"],
                title: 'Error'
            },
            sections: [{
                id: 'mainNav',
                template: 'default/templates/mainNav',
                logoText: 'COSM',
                logoUrl: '/',
                // logoImg: '/static/img/logo-main.svg',
            }, {
                id: 'errorSection',
                template: 'default/templates/error',
            }, {
                id: 'footer',
                template: 'default/templates/footer',
            }],
            scripts: ["/static/javascripts/min/common.js"]
        }, {
            name: 'login',
            head: {
                styles: ["/static/css/login.css"],
                title: 'Login'
            },
            sections: [{
                id: 'login',
                template: 'default/templates/login',
            }],
            scripts: ["/static/javascripts/min/login.js"]
        }, {
            name: 'admin/pages',
            head: {
                styles: [
                    "/static/admin/build/css/custom.css",
                    "/static/css/admin.css"
                ],
                title: 'Admin panel'
            },
            sections: [{
                id: 'admin',
                template: 'default/admin/staticPageList',
            }],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.7/handlebars.min.js",
                "/static/admin/build/js/custom.js",
                "/static/javascripts/min/admin.js"
            ]
        }, {
            name: 'admin/pages/new',
            head: {
                styles: [
                    "/static/admin/build/css/custom.css",
                    "/static/css/admin.css"
                ],
                scripts: [
                    "//cdn.tinymce.com/4/tinymce.min.js",
                    "/static/admin/build/js/tinyInit.js"
                ],
                title: 'Admin panel - create page'
            },
            sections: [{
                id: 'admin',
                template: 'default/admin/staticPageNew',
                title: 'Create page'
            }],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.7/handlebars.min.js",
                "/static/admin/build/js/custom.js",
                "/static/javascripts/min/admin.js"
            ]
        }, {
            name: 'admin/pages/edit',
            head: {
                styles: [
                    "/static/admin/build/css/custom.css",
                    "/static/css/admin.css"
                ],
                scripts: [
                    "//cdn.tinymce.com/4/tinymce.min.js",
                    "/static/admin/build/js/tinyInit.js"
                ],
                title: 'Admin panel - edit page'
            },
            sections: [{
                id: 'admin',
                template: 'default/admin/staticPageNew',
                title: 'Edit page'
            }],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.7/handlebars.min.js",
                "/static/admin/build/js/custom.js",
                "/static/javascripts/min/admin.js"
            ]
        },
        {
            name: 'admin/feedbacks',
            head: {
                styles: [
                    "/static/admin/build/css/custom.css",
                    "/static/css/admin.css"
                ],
                title: 'Feedback'
            },
            sections: [{
                id: 'admin',
                template: 'default/admin/feedbacks',
            }],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.7/handlebars.min.js",
                "/static/admin/build/js/custom.js",
                "/static/javascripts/min/admin.js",
                "/static/javascripts/min/feedbacks.js",
            ]
        },
        {
            name: 'admin/menus',
            head: {
                styles: [
                    "/static/admin/build/css/custom.css",
                    "/static/css/admin.css"
                ],
                title: 'Menus'
            },
            sections: [{
                id: 'menus',
                template: 'default/admin/menus',
            }],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.7/handlebars.min.js",
                "/static/admin/build/js/custom.js",
                "/static/javascripts/min/admin.js",
                "/static/javascripts/min/menus.js",
            ]
        },
        {
            name: 'admin',
            head: {
                styles: [
                    "/static/admin/build/css/custom.css",
                    "/static/css/admin.css"
                ],
                title: 'Admin panel'
            },
            sections: [{
                id: 'admin',
                template: 'default/templates/admin',
                content: `<h3><b>Welcome to admin dashboard</b></h3>`
            }],
            scripts: [
                "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.7/handlebars.min.js",
                "/static/admin/build/js/custom.js",
                "/static/javascripts/min/admin.js"
            ]
        }];

    async.eachSeries(pages, function (item, callback) {
        let page = new mongoose.models.CorePage(item);
        page.save(function (err) {
            callback(err, page);
        })
    }, callback);
}

function createPages(callback) {
    let pages = [
        {
            name: 'main',
            head: {
                styles: ["/static/css/main-style.css"],
                title: 'COSM - Main page',
                meta: [
                    {
                        name: 'description',
                        content: 'Development of software'
                    },
                    {
                        name: 'author',
                        content: 'COSM'
                    }
                ]
            },
            sections: [{
                logo: {
                    text: 'C<i class="fa fa-lightbulb-o" aria-hidden="true"></i>SM',
                    url: '/',
                    // img: '/static/img/logo-main.svg',
                },
                template: 'default/templates/header',
                background: '/static/img/computer2.jpg',
                title: 'Technologies unite people',
                description: 'We suggest to create mutually beneficial collaboration in interaction of information technologies with business',
                fullScreen: true,
                btn: {
                    text: 'Learn more',
                    url: '/about'
                }
            },
                {
                    id: 'solutions',
                    classes: ['bg-light'],
                    template: 'default/templates/items',
                    title: 'Our solutions',
                    itemsInRow: 3,
                    description: 'We create and develop multifunctional projects using different solutions and technologies',
                    itemList: [
                        {
                            img: '/static/img/ecommerce_s.svg',
                            title: 'E-commerce',
                            description: 'Creating on-line shops and web-sites for small businesses and large companies together with website promotion'
                        },
                        {
                            img: '/static/img/enterprise_s.svg',
                            title: 'Enterprise',
                            description: 'Digital transformation of your business for leveling up your company`s quality, effectiveness, transparency and functioning'
                        },
                        {
                            img: '/static/img/android_s.svg',
                            title: 'Android',
                            description: 'Android apps development for any business'
                        }
                    ],
                    btn: {
                        text: 'Learn more',
                        url: '/solutions'
                    },
                },
                {
                    id: 'technologies',
                    classes: ['bg-primary', 'thin'],
                    template: 'default/templates/technologies',
                    itemsInRow: 6,
                    title: 'Technologies',
                    description: 'To realize your project, we use up-to-date technologies and programming languages that are in demand',
                    itemList: [
                        {
                            iconClass: "devicons devicons-javascript_badge",
                            title: 'JavaScript',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-nodejs_small",
                            title: 'Node.js'
                        },
                        {
                            iconClass: "devicons devicons-bootstrap",
                            title: 'Bootstrap',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-angular",
                            title: 'Angular',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-sass",
                            title: 'Sass/scss',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-gulp",
                            title: 'Gulp',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-dotnet",
                            title: '.NET',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-java",
                            title: 'Java'
                        },
                        {
                            iconClass: "devicons devicons-android",
                            title: 'Android',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-mongodb",
                            title: 'MongoDB',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-postgresql",
                            title: 'Postgresql',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                        {
                            iconClass: "devicons devicons-mysql",
                            title: 'MySql',
                            description: 'Development of web-applications that are deployed on one web-page and dynamically loaded the content'
                        },
                    ],
                    btn: {
                        text: 'Learn more',
                        url: '/solutions'
                    }

                }
                , {
                    id: 'contacts',
                    template: 'default/templates/bgImage',
                    classes: ['bg-primary'],
                    title: 'Do you have any questions? Contact us',
                    btn: {
                        text: 'Contacts',
                        url: '/contacts'
                    },
                    background: '/static/img/bg-cta.jpg'

                }, {
                    id: 'footer',
                    template: 'default/templates/footer'
                }
            ],
            scripts: ["/static/javascripts/min/common.js"]
        },
        {
            name: 'about',
            head: {
                styles: ["/static/css/main-style.css"],
                title: 'COSM - About us'
            },
            sections: [{
                template: 'default/templates/header',
                logo: {
                    text: 'C<i class="fa fa-lightbulb-o" aria-hidden="true"></i>SM',
                    url: '/',
                    // img: '/static/img/logo-main.svg',
                },
                background: '/static/img/computer3.jpg',
                title: 'We welcome you',
                description: "Learn more about our team",
                fullScreen: true
            },
                {
                    id: 'team',
                    classes: ['bg-light'],
                    template: 'default/templates/items',
                    itemsInRow: 4,
                    title: 'Our developers are...',
                    description: 'People making our world better.',
                    itemList: [
                        {
                            img: '/static/img/proger_s.svg',
                            title: 'Programmers',
                            description: 'Unique human resourses capable of finding decisions in any difficult situation as well as realising fast and reliable algorithms for your projects.'
                        },
                        {
                            img: '/static/img/dis_s.svg',
                            title: 'Designers',
                            description: 'Creative people who create unbelievable design. They are always aware of popular color schemes and modern style.'
                        },
                        {
                            img: '/static/img/testi_s.svg',
                            title: 'QA specialists',
                            description: 'Responsible people who can guarantee quality of developing projects  via performing multiple tests.'
                        },
                        {
                            img: '/static/img/manager_s.svg',
                            title: 'Managers',
                            description: 'They are a solid \"connecting link\" between you and our team of developers. Our managers are always ready to provide you with more beneficial solitions for your issues.'
                        }
                    ]
                }, {
                    id: 'ourOffers',
                    classes: ['bg-primary', 'big-img'],
                    background: '/static/img/keyboard.jpg',
                    template: 'default/templates/items',
                    itemsInRow: 3,
                    title: 'We are an unanimous and hard-working team',
                    description: 'Working with our team is...',
                    itemList: [
                        {
                            img: '/static/img/pizza.png',
                            title: 'Delicious',
                        }, {
                            img: '/static/img/UFO.png',
                            title: 'Very interesting',
                        }, {
                            img: '/static/img/Gamepad.png',
                            title: 'Joyful',
                        }
                    ]
                }, {
                    id: 'footer',
                    template: 'default/templates/footer'
                }
            ],
            scripts: ["/static/javascripts/min/common.js"]
        },
        {
            name: 'contacts',
            head: {
                styles: ['/static/css/main-style.css', '/static/css/contacts.css'],
                title: 'COSM - Contacts'
            },
            sections: [
                {
                    template: 'default/templates/header',
                    logo: {
                        text: 'C<i class="fa fa-lightbulb-o" aria-hidden="true"></i>SM',
                        url: '/',
                        // img: '/static/img/logo-main.svg',
                    },
                    classes: ['bg-primary'],
                    background: '/static/img/computer6sm.jpg',
                    title: 'Contact us',
                    fullScreen: false
                },
                {
                    id: 'contact-us',
                    background: '/static/img/computer6sm.jpg',
                    classes: ['bg-primary'],
                    template: 'default/templates/contactForm',
                    title: 'Contact us',
                    form: {
                        placeholders: {
                            name: 'Name...',
                            phone: 'Phone...',
                            email: 'Email...',
                            message: 'Message...'
                        }
                    },
                    office: {
                        address: '25, Dovskaya St.',
                        city: 'Gomel',
                        country: 'Belarus',
                        info: {
                            MTC: '+375 33 111 11 11',
                            email: 'COSM@mail.com',
                            skype: 'COSM@mail.com'
                        }
                    },
                    pageScroll: {
                        href: '#our-location'
                    },
                    btn: {
                        text: 'Send',
                        url: '#contact-us'
                    }
                },
                {
                    id: 'our-location',
                    classes: ['bg-light'],
                    template: 'default/templates/map',
                    coord: {
                        lat: 52.501451,
                        lng: 30.963902
                    },
                    markerUrl: '/static/img/map_icon.png'
                }, {
                    id: 'footer',
                    template: 'default/templates/footer'
                }
            ],
            scripts: [
                "/static/javascripts/min/common.js",
                "/static/javascripts/min/contacts.js",
                "https://maps.googleapis.com/maps/api/js?key=AIzaSyDd5P6wKMz6lakYSnZFKA59vEOC1fuf8Sk"]
        },
        {
            name: 'solutions',
            head: {
                styles: ["/static/css/main-style.css"],
                title: 'COSM - Our solutions'
            },
            sections: [{
                logo: {
                    text: 'C<i class="fa fa-lightbulb-o" aria-hidden="true"></i>SM',
                    url: '/',
                    // img: '/static/img/logo-main.svg',
                },
                template: 'default/templates/header',
                background: '/static/img/computer.jpg',
                title: 'Our solutions',
                description: 'We`ll carry out all your projects',
                fullScreen: true
            },
                {
                    id: 'web-services',
                    classes: ['bg-light', 'img-fade'],
                    template: 'default/templates/leftRightItems',
                    title: 'WEB Servises',
                    description: 'We carry out Web-servises of different nature',
                    itemList: [
                        {
                            img: '/static/img/ell.jpg',
                            title: 'COSM (our site)',
                            description: 'We are glad to introduce one of our current projects - our new web-site! It`s a realization of our developers` idea that unites in itself the power of optimization, creativity together with diligence of the developers. This product as well as all our projects is created with love and great attention paid to the details.',
                            url: '#web-services'
                        }, {
                            img: '/static/img/new.jpg',
                            title: 'future projects',
                            description: 'We are intended to create new, more perfect software products. Each new product corresponds to different requisitions and is used in different spheres from e-commerse to mobile apps. We`ll carry out all your ideas.'
                        }
                    ]
                },
                {
                    id: 'technologies',
                    classes: ['bg-primary'],
                    title: 'Technologies',
                    template: 'default/templates/lists',
                    description: 'To carry our projects we use a vast list of technologies.',
                    itemList: [
                        {
                            img: '/static/img/cooding.png',
                            title: 'Programming',
                            items: ['Java', 'Node.js', 'C#', 'Php', 'JavaScript', 'TypeScript']
                        },
                        {
                            img: '/static/img/db.png',
                            title: 'Databases',
                            items: ['Oracle', 'MySQL', 'SqlLite', 'MongoDB', 'DB2']
                        },
                        {
                            img: '/static/img/frm.png',
                            title: 'Frameworks and libraries',
                            items: ['Spring (java)', 'Play (java)', 'EJB (java)', 'Express (node.js)', 'Play (scala)']
                        },
                        {
                            img: '/static/img/design.png',
                            title: 'Design',
                            items: ['JavaScript', 'HTML5', 'CSS3', 'SASS', 'LESS']
                        }
                    ]
                },{
                    id: 'footer',
                    template: 'default/templates/footer'
                }
            ],
            scripts: ["/static/javascripts/min/common.js"]
        }
    ]

    async.each(pages, function (item, callback) {
        let page = new mongoose.models.Page(item);
        page.save(function (err) {
            callback(err, page);
        })
    }, callback);
}







