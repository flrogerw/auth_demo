const { expect } = require('chai');
const authService = require('../../../src/services/auth');
const initAuthRequestMock = require('../../fixtures/initAuthRequest.json');
const initAuthResponseMock = require('../../fixtures/initAuthResponse.json');
const challengeAuthRequestMock = require('../../fixtures/challengeAuthRequest.json');

describe('Unit Testing Auth Service', () => {
  context('init function', () => {
    it('should return a valid Cognito Auth Challenge object',
      () => authService.init(initAuthRequestMock)
        .then((result) => {
          return expect(result).to.deep.equal(initAuthResponseMock);;
        }));

    it('Should return a JWT',
      () => authService.challenge(challengeAuthRequestMock)
        .then((result) => {
          return expect(result).to.have.lengthOf.above(100);
        }));
      });
    });
