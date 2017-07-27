process.env.NODE_ENV = 'test';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../www.js'),
    Menu = require('../app/models').Menu,
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

var agent = chai.request.agent(server);

setTimeout(function () {
        describe('Menu', () => {
            beforeEach((done) => {
                require('../createDB');
                agent
                    .post('/login')
                    .send({login: 'admin', password: 'pass'})
                    .then(function () {
                        done();
                    });
            });

            describe('/GET /api/menu', () => {
                it('it should return status 401 because you are not authorized', (done) => {
                    chai.request(server)
                        .get('/api/menu')
                        .set('Content-type', 'application/json')
                        .end((err, res) => {
                            res.should.have.status(401);
                            done();
                        });
                });
            });

            describe('/GET /api/menu', () => {
                it('it should GET menu list', (done) => {
                    agent
                        .get('/api/menu')
                        .end((err, res) => {
                            console.log(res.body)
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.total.should.equal(4);
                            res.body.limit.should.equal(20);
                            res.body.page.should.equal(1);
                            res.body.pages.should.equal(1);
                            res.body.docs.should.be.a('array');

                            res.body.docs.forEach((doc) => {
                                doc.href.should.be.a('string');
                                doc.text.should.be.a('string');
                                doc._links.self.should.be.a('string');
                            });

                            done();
                        });
                });
            });

            describe('/GET /api/menu/{id}', () => {
                it('it should GET menu item by it`s id', (done) => {
                    let menuItemMock = new Menu(testMenuItemMock);
                    menuItemMock.save(() => {
                        agent
                            .get(`/api/menu/${menuItemMock._id}`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.should.be.json;

                                res.body.should.have.property('_id');
                                res.body.href.should.equal('/test');
                                res.body.text.should.equal('test menu item');

                                done();
                            });
                    });
                });
            });

            describe('/GET /api/menu/{id}', () => {
                it('it should return 404 error, because this menu item does not exists', (done) => {
                    agent
                        .get(`/api/menu/123`)
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });
            });

            describe('/POST /api/menu', () => {
                it('it should add new menu item to db', (done) => {
                    agent
                        .post('/api/menu')
                        .send({
                            text: "test",
                            href: "/test"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.json;

                            res.body.should.be.a('object');
                            res.body.should.have.property('_id');

                            res.body.href.should.equal('/test');
                            res.body.text.should.equal('test');

                            res.body._links.self.should.be.a("string");

                            done();

                        });
                });
            });

            describe('/POST /api/menu', () => {
                it('it should return bad request, because data is invalid', (done) => {
                    agent
                        .post('/api/menu')
                        .send({})
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.should.be.json;

                            res.body.validations.body.forEach((err) => {
                                err.should.have.property('property');
                                err.should.have.property('messages');
                                err.messages.should.be.a('array');
                            });
                            done();
                        });
                });
            });

            describe('/PUT /api/menu/{id}', () => {
                it('it should update menu item by id', (done) => {
                    let menuItemMock = new Menu(testMenuItemMock);
                    menuItemMock.save(() => {
                        agent
                            .put(`/api/menu/${menuItemMock._id}`)
                            .send({
                                text: "updated test",
                                href: "/updated"
                            })
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.should.be.json;

                                res.body.should.be.a('object');
                                res.body.should.have.property('_id');

                                res.body.href.should.equal('/updated');
                                res.body.text.should.equal('updated test');

                                Menu.findById(menuItemMock._id, (err, result) => {
                                    result.href.should.equal('/updated');
                                    result.text.should.equal('updated test');
                                    done();
                                });

                            });
                    });
                });
            });

            describe('/PUT /api/menu/{id}', () => {
                it('it should return bad request because data is invalid', (done) => {
                    let menuItemMock = new Menu(testMenuItemMock);
                    menuItemMock.save(() => {
                        agent
                            .put(`/api/menu/${menuItemMock._id}`)
                            .send({})
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.should.be.json;

                                res.body.validations.body.forEach((err) => {
                                    err.should.have.property('property');
                                    err.should.have.property('messages');
                                    err.messages.should.be.a('array');
                                });

                                done();
                            });
                    });
                });
            });

            describe('/PUT /api/menu/{id}', () => {
                it('it should return 404 because this menu item does not exists', (done) => {
                    agent
                        .put(`/api/menu/123`)
                        .send({
                            text: "updated test",
                            href: "/updated"
                        })
                        .end((err, res) => {
                            res.should.have.status(404);

                            done();
                        });
                });
            });


            describe('/DELETE /api/menu/{id}', () => {
                it('it should DELETE feedback by it`s id', (done) => {
                    let menuItemMock = new Menu(testMenuItemMock);
                    menuItemMock.save(() => {
                        agent
                            .delete(`/api/menu/${menuItemMock._id}`)
                            .end((err, res) => {
                                res.should.have.status(200);

                                res.body.should.have.property('_id');

                                res.body.href.should.equal('/test');
                                res.body.text.should.equal('test menu item');

                                Menu.findById(menuItemMock._id, (err, res) => {
                                    expect(res).to.be.null;
                                    done();
                                });
                            });

                    });
                });
            });

            describe('/DELETE /api/menu/{id}', () => {
                it('it should return 404 error, because this menu item does not exists', (done) => {
                    agent
                        .delete(`/api/menu/123`)
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });
            });

        });
        run();
    },
    5000
);

var testMenuItemMock = {
    href: "/test",
    text: "test menu item",
};

