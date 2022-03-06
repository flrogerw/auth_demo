const chai = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
const { url } = require('../../mock_server');
const initAuthRequestMock = require('../../fixtures/initAuthRequest.json');
const initAuthRequestBad = require('../../fixtures/initAuthRequestBad.json');
const initAuthResponseMock = require('../../fixtures/initAuthResponse.json');
const challengeAuthRequestMock = require('../../fixtures/challengeAuthRequest.json');
const challengeAuthRequestBad = require('../../fixtures/challengeAuthRequestBad.json');

chai.use(chaiHttp);
const { expect } = chai;


describe('Cognito Authorization endpoint', () => {
  context('Call Cognito Auth Init', () => {
    it('should return a challenge object response', () => {
      return request(url).post('/auth/init')
        .send(initAuthRequestMock)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).to.deep.equal(initAuthResponseMock);
        })
    });
  });

  context('Call Cognito Auth Challenge endpoint', () => {
    it('should return a JWT response', () => {
      return request(url).post('/auth/challenge')
        .send(challengeAuthRequestMock)
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .then((res) => {
          expect(res.text).to.have.lengthOf.above(100)
        })
    });
  });

  context('Call Cognito Auth Init with BAD email address', () => {
    it('should return a validation error', () => {
      return request(url).post('/auth/init')
        .send(initAuthRequestBad)
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  context('Call Cognito Auth Challenge with BAD email address', () => {
    it('should return a validation error', () => {
      return request(url).post('/auth/init')
        .send(challengeAuthRequestBad)
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});