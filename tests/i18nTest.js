process.env.NODE_ENV = 'test';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../www.js'),
    should = chai.should();

chai.use(chaiHttp);


setTimeout(function () {
        describe('i18n', () => {
            beforeEach((done) => {
                done();
            });

            describe('/GET /api/i18n', () => {
                it('it should return english messages', (done) => {
                    chai.request(server)
                        .get('/api/i18n')
                        .set('Cookie', 'lang=en')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.Test.should.equal('Test');
                            res.body['Test message'].should.equal('Test message');
                            done();
                        });
                });
            });

            describe('/GET /api/i18n', () => {
                it('it should return russian messages', (done) => {
                    chai.request(server)
                        .get('/api/i18n')
                        .set('Cookie', 'lang=ru')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.Test.should.equal('Тест');
                            res.body['Test message'].should.equal('Тестовое сообщение');
                            done();
                        });
                });
            });

            describe('/GET /api/i18n', () => {
                it('it should return one message', (done) => {
                    chai.request(server)
                        .get('/api/i18n?phrases[]=Test')
                        .set('Cookie', 'lang=en')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.Test.should.equal('Test');
                            res.body.should.not.have.property('Test message');
                            done();
                        });
                });
            });
        });
        run();
    },
    5000
);

