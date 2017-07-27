process.env.NODE_ENV = 'test';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../www.js'),
    Page = require('../app/models/page').Page,
    should = chai.should();

chai.use(chaiHttp);

var agent = chai.request.agent(server);

setTimeout(function () {
    describe('Pages', () => {
        beforeEach((done) => {
            require('../createDB');
            done();
        });

        describe('/GET /', () => {
            it('it should GET home page', (done) => {
                chai.request(server)
                    .get('/')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });

        describe('/GET /about', () => {
            it('it should GET about page', (done) => {
                chai.request(server)
                    .get('/about')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });

        describe('/GET /api/pages', () => {
            it('it should GET pages from api', (done) => {
                agent
                    .post('/login')
                    .send({login: 'admin', password: 'pass'})
                    .then(function (res) {
                        agent
                            .get('/api/pages')
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.should.be.json;
                                res.body.should.be.a('object');
                                res.body.total.should.equal(4);
                                res.body.limit.should.equal(20);
                                res.body.page.should.equal(1);
                                res.body.pages.should.equal(1);
                                res.body.docs.should.be.a('array');
                                res.body.docs.length.should.equal(4);

                                res.body.docs.forEach((doc) => {
                                    doc.should.have.property('name');
                                    doc.should.have.property('_id');
                                    doc.should.have.property('_links');
                                    doc._links.should.have.property('self');
                                });

                                done();
                            });
                    });
            });
        });

        describe('/GET /api/pages/{id}', () => {
            it('it should GET one page from api', (done) => {
                let pageMock = new Page(testPageMock);
                pageMock.save((err) => {
                    if (err) return;
                    agent
                        .post('/login')
                        .send({login: 'admin', password: 'pass'})
                        .then(function () {
                            agent
                                .get(`/api/pages/${pageMock._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);

                                    res.body.should.be.a('object');
                                    res.body.should.have.property('name');

                                    res.body.name.should.equal('test');

                                    res.body.head.styles.should.be.a('array');
                                    res.body.head.title.should.be.a('string');
                                    res.body.head.title.should.equal('TEST PAGE');
                                    res.body.head.meta.should.be.a('array');

                                    res.body.sections.should.be.a('array');
                                    res.body.sections[0].id.should.equal('test section');
                                    res.body.sections[0].template.should.equal('test/template');

                                    res.body.scripts.should.be.a('array');
                                    res.body.scripts[0].should.equal('/test.js');

                                    done();
                                });
                        });
                });
            });
        });
    });
    run();
}, 5000);

var testPageMock = {
    name: 'test',
    head: {
        styles: ["/test.css"],
        title: 'TEST PAGE',
        meta: [
            {
                name: 'test meta name',
                content: 'test meta content'
            }
        ]
    },
    sections: [{
        id: 'test section',
        template: 'test/template'
    }
    ],
    scripts: ["/test.js"]
};

