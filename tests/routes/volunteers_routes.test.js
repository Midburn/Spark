const app = require('../../app');
const should = require('chai').should();
const request = require('supertest')(app);


describe('Tests are fine', function() {
    it('responds to / with redirect to hebrew', function testSlash(done) {
        request
            .get('/')
            .expect('Location', '/he/login?r=/')
            .expect(302, done);
    });
});

describe('Getters all respond', function() {
    it('returns roles', function getRoles(done) {
        request
            .get('/volunteers/roles/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                    done(err);
                }
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.greaterThan(2);

                const role = res.body[0];
                role.should.exist;
                role.should.have.property('id');
                role.should.have.property('name');

                done();
            });
    });

    it('returns departments', function getDeprtments(done) {
        request
            .get('/volunteers/departments/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                    done(err);
                }
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.greaterThan(2);

                //console.log(`DEPARTMENTS BODY:\n${JSON.stringify(res.body)}`);

                const department = res.body[0];
                department.should.exist;
                department.should.have.property('id');
                //TODO FAILS department.should.have.property('name'); //Uncaught AssertionError: expected { Object (id, name_en, ...) } to have a property 'name'
                department.should.have.property('name_en');
                department.should.have.property('name_he');

                done();
            });
    });

    it.skip('returns volunteers', function(done) {
        request
        get('/volunteers/volunteers')
            .expect(200, done);
    });

    it.skip('returns volunteers of department 1', function(done) {
        request
            .get('/volunteers/departments/1/volunteers')
            .expect(200, done);
    });

    it.skip('reuturns volunteers of all departments', function(done) {
        //Iterate over all departments and see they are returning zero or more volunteers and the count is equal
        done();
    });
});

describe.skip('Volunteers addition', function() {
    //ading one
    //add and get
    //collision returns error and does not change existing
    //extra fields are rejected
    //missing fields are ignored or rejected
    //length and type limits on mail and numbers
    //wrong format 
});


describe.skip('Volunteers editing', function() {
    //editing one
    //edit and get
    //edit non existing
    //extra fields are rejected
    //missing fields are ignored or rejected
    //length and type limits on mail and numbers
    //wrong format 
});


describe('Volunteers deletion', function() {
    //deleting one
    //get and delete and get
    //delete non existing
    //delete deos not affect other departments
});