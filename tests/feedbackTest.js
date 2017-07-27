process.env.NODE_ENV = 'test';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../www.js'),
    Feedback = require('../app/models/feedback').Feedback,
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

var agent = chai.request.agent(server);

setTimeout(function () {
        describe('Feedback', () => {
            beforeEach((done) => {
                require('../createDB');
                done();
            });

            describe('/GET /api/feedbacks', () => {
                it('it should return status 401 because you are not authorized', (done) => {
                    agent
                        .get('/api/feedbacks')
                        .set('Content-type', 'application/json')
                        .end((err, res) => {
                            res.should.have.status(401);
                            done();
                        });
                });
            });

            describe('/GET /api/feedbacks', () => {
                it('it should GET feedback list from api', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(function () {
                            agent
                                .get('/api/feedbacks')
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.should.be.json;
                                    res.body.should.be.a('object');
                                    res.body.total.should.equal(1);
                                    res.body.limit.should.equal(20);
                                    res.body.page.should.equal(1);
                                    res.body.pages.should.equal(1);
                                    res.body.docs.should.be.a('array');

                                    res.body.docs[0].name.should.equal('system');
                                    res.body.docs[0].email.should.equal('system@system.com');
                                    res.body.docs[0].status.should.equal('NEW');
                                    res.body.docs[0].isImportant.should.equal(true);
                                    res.body.docs[0].shortMessage.should.equal('welcome to system');
                                    res.body.docs[0].should.have.property('_links');
                                    res.body.docs[0]._links.should.have.property('self');

                                    done();
                                });
                        });
                });
            });

            describe('/GET /api/feedbacks/{id}', () => {
                it('it should GET feedback by it`s id from api', (done) => {
                    let feedbackMock = new Feedback(testFeedbackMock);
                    feedbackMock.save(() => {
                        agent
                            .post('/login')
                            .send({login: 'admin', password: 'pass'})
                            .then(function () {
                                agent
                                    .get(`/api/feedbacks/${feedbackMock._id}`)
                                    .end((err, res) => {
                                        res.should.have.status(200);
                                        res.should.be.json;
                                        res.body.should.be.a('object');

                                        res.body.should.have.property('_id');
                                        res.body.status.should.equal('NEW');
                                        res.body.name.should.equal('test');
                                        res.body.email.should.equal('test@test.com');
                                        res.body.message.should.equal('message for test');
                                        res.body.isImportant.should.equal(true);

                                        done();
                                    });
                            });
                    });
                });
            });

            describe('/GET /api/feedbacks/{id}', () => {
                it('it should return 404 error, because this feedback does not exists', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(function () {
                            agent
                                .get(`/api/feedbacks/123`)
                                .end((err, res) => {
                                    res.should.have.status(404);
                                    done();
                                });
                        });
                });
            });

            describe('/POST /api/feedbacks', () => {
                it('it should add new feedback to db', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(function () {
                            agent
                                .post('/api/feedbacks')
                                .send({
                                    name: "Test name",
                                    email: "test@test.com",
                                    phone: "+111111111111",
                                    message: "test message"
                                })
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.should.be.json;

                                    res.body.should.be.a('object');
                                    res.body.should.have.property('_id');

                                    res.body.name.should.equal('Test name');
                                    res.body.email.should.equal('test@test.com');
                                    res.body.phone.should.equal('+111111111111');
                                    res.body.status.should.equal('NEW');
                                    res.body.shortMessage.should.equal('test message');

                                    Feedback.findById(res.body._id, (err, feedback) => {
                                        feedback.name.should.equal('Test name');
                                        feedback.email.should.equal('test@test.com');
                                        feedback.phone.should.equal('+111111111111');
                                        feedback.status.should.equal('NEW');
                                        feedback.message.should.equal('test message');
                                        done();
                                    });

                                });
                        });
                });
            });

            describe('/POST /api/feedbacks', () => {
                it('it should return bad request, because data is invalid', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(function () {
                            agent
                                .post('/api/feedbacks')
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

            describe('/DELETE /api/feedbacks/{id}', () => {
                it('it should DELETE feedback by it`s id', (done) => {
                    let feedbackMock = new Feedback(testFeedbackMock);
                    feedbackMock.save(() => {
                        agent
                            .post('/login')
                            .send({login: 'admin', password: 'pass'})
                            .then(function () {
                                agent
                                    .delete(`/api/feedbacks/${feedbackMock._id}`)
                                    .end((err, res) => {
                                        res.should.have.status(200);
                                        res.should.be.json;
                                        res.body.should.be.a('object');

                                        res.body.should.have.property('_id');
                                        res.body.status.should.equal('NEW');
                                        res.body.name.should.equal('test');
                                        res.body.email.should.equal('test@test.com');
                                        res.body.message.should.equal('message for test');
                                        res.body.isImportant.should.equal(true);

                                        Feedback.findById(feedbackMock._id, (err, res) => {
                                            expect(res).to.be.null;
                                            done();
                                        });
                                    });
                            });
                    });
                });
            });

            describe('/DELETE /api/feedbacks/{id}', () => {
                it('it should return 404 error, because this feedback does not exists', (done) => {
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(function () {
                            agent
                                .delete(`/api/feedbacks/123`)
                                .end((err, res) => {
                                    res.should.have.status(404);
                                    done();
                                });
                        });
                });
            });

        });
        run();
    },
    5000
);

var testFeedbackMock = {
    name: 'test',
    email: 'test@test.com',
    message: 'message for test',
    status: 'NEW',
    isImportant: true
};

