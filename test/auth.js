const { expect } = require('chai');
const app = require('../app');
const request = require('supertest');
const User = require('../models/User');

describe('singup', function() {
  const signup = '/auth/signup';
  const testUser = {
    email : 'teststart@naver.com',
    name : '해리',
    password: '33333333',
  };

  after(async () => {
    await User.findOneAndDelete({ name: testUser.name });
  });

  it ('Should create a new account', function(done) {
    this.timeout(10000);
    request(app)
      .post(signup)
      .send(testUser)
      .end((err, res) => {
        const { result, user } = res.body;
        expect(res.status).to.equal(200);
        expect(result).to.equal('ok');
        expect(user.email).to.equal('teststart@naver.com');
        expect(user.name).to.equal('해리');
        done();
      });
  });
});

describe('singup duplicated email', function() {
  const signup = '/auth/signup';
  const testUser = {
    email : 'test@naver.com',
    name : '해리',
    password: '33333333',
  };

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(signup)
      .send(testUser)
      .end((err, res) => {
        done();
      });
  });

  it ('Should send 401 error when the email already exists', function(done) {
    this.timeout(5000);
    request(app)
      .post(signup)
      .send(testUser)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});

describe('login', function() {
  const login = '/auth/login';
  const signup = '/auth/signup';

  const wrongUser = {
    email: 'yoyo@naver.com',
    name: '해리',
    password: '33333333'
  };

  const wrongPassword = {
    email : 'test@naver.com',
    name : '해리',
    password: '123123',
  };

  const testUser = {
    email : 'test@naver.com',
    name : '해리',
    password: '33333333',
  };

  before((done) => {
    this.timeout(5000);
    request(app)
      .post(signup)
      .send(testUser)
      .end((err, res) => {
        done();
      });
  });

  after(async() => {
    await User.findOneAndDelete({ name: testUser.name });
  });

  it ('Should send 422 error when the user doesn not exist', function(done) {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(wrongUser)
      .end((err, res) => {
        expect(res.status).to.equal(422);
        done();
      });
  });

  it ('Should send 401 error when password is wrong', function(done) {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(wrongPassword)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });

  it ('Should send 200 code with a token when the information is correct ', function(done) {
    this.timeout(5000);
    request(app)
      .post(login)
      .send(testUser)
      .end((err, res) => {
        const { token, result } = res.body;
        expect(result).to.equal('ok');
        expect(token).to.be.ok;
        expect(res.status).to.equal(200);
        done();
      });
  });
});
