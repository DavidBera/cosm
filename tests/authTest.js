process.env.NODE_ENV = 'test';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../www.js'),
    should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(server);

setTimeout(function () {
        describe('Authentication', () => {
            beforeEach((done) => {
                require('../createDB');
                done();
            });

            describe('/POST /login', () => {
                it('it should return success login status', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('redirectUrl')
                            done();
                        });
                });
            });


            describe('/POST /login', () => {
                it('it should return status 403 login and password are incorrect', (done) => {
                    agent
                        .post('/login')
                        .set('Content-type', 'application/json')
                        .send({login: 'incorrect_login', password: 'incorrect_password'})
                        .end((err, res) => {
                            res.should.have.status(403);
                            done();
                        });
                });
            });

            describe('/POST /logout', () => {
                it('it should return success status of logout', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(() => {
                            agent
                                .post('/logout')
                                .set('Content-type', 'application/json')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    done();
                                });
                        });
                });
            });

            describe('/POST /logout', () => {
                it('it should return 401 because user is not authorized', (done) => {
                    agent
                        .post('/logout')
                        .set('Content-type', 'application/json')
                        .end((err, res) => {
                            res.should.have.status(401);
                            done();
                        });
                });
            });

        });
        run();
    },
    5000
);

