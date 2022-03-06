const AWS = require('aws-sdk');
const { SRPClient, calculateSignature, getNowString } = require('amazon-user-pool-srp-client');
const jwt = require('jsonwebtoken');
const ReturnMock = true;
AWS.config.region = process.env.AWS_REGION

/**
 * Mock Init Authorization Response 
 * @private
 * @constant
 * @type {string}
 */
const _initAuthResponseMock = require('../fixtures/initAuthResponse.json');
/** 
 * Mock Challenge Authorization Response
 * @private 
 * @constant
 * @type {string}
 */
const _challengeAuthResponseMock = require('../fixtures/challengeAuthResponse.json');
/** 
 * Mock Challenge Authorization Request
 * @private
 * @constant
 * @type {string}
 */
const _challengeAuthRequestMock = require('../fixtures/challengeAuthRequest.json');

/**
 * Initialize Cognito Authorization using user input.  This is the first step in the Authentication process.
 * @method
 * @param {object} body - Express request body object.
 * @return - Object containing challenge parameters for step 2.
 */
function init(body) {
  try {
    const { USERNAME, SRP_A, CLIENT_ID } = body;
    const authRequest = {
      "AuthFlow": "USER_SRP_AUTH",
      "AuthParameters": {
        USERNAME,
        SRP_A,
      },
      "ClientId": CLIENT_ID,
      "UserPoolId": process.env.USER_POOL_ID
    }
    return _initAuth(authRequest);
  } catch (err) {
    Promise.reject(error);
  }
}

/**
 * Cognito Authorization Challenge request.  This is the final step in the Authentication process.
 * @async
 * @method
 * @param {object} body - Express request body object.
 * @returns {string} - Encrypted string of the Cognito Authorization Object containing access token or an Error.
 */
async function challenge(body) {
  try {
    const challengeRequest = await _getChallengeRequest(body);
    const response = await _challengeAuth(challengeRequest);
    const params = {
      expiresIn: '1h'
    }
    response.Username = body.USERNAME;
    const token = jwt.sign(response, process.env.SECRET, params);
    return Promise.resolve(token);
  } catch (error) {
    Promise.reject(error);
  }
}

/**
 * Cognito Initiate Authorization request call.
 * @private
 * @method
 * @param {object} - Valid Init Auth Request object.
 * @returns {object} Authentic initAuthResponse
 */
function _initAuth(authRequest) {
  if (ReturnMock) return Promise.resolve(_initAuthResponseMock);
  try {
    let cognitoProvider = new AWS.CognitoIdentityServiceProvider();
    return cognitoProvider.adminInitiateAuth(authRequest, (err, data) => {
      if (err) { throw err; }
      return Promise.resolve(data);
    })
      .catch(error => {
        return Promise.reject(error);
      });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Cognito Challenge Authorization request call.
 * @private
 * @method
 * @param {object} - _challengeAuthRequest
 * @returns {object} - _challengeAuthResponse
 */
function _challengeAuth(challengeRequest) {
  if (ReturnMock) return Promise.resolve(_challengeAuthResponseMock);
  try {
    let cognitoProvider = new AWS.CognitoIdentityServiceProvider();
    return cognitoProvider.respondToAuthChallenge(challengeRequest, (err, data) => {
      if (err) { throw err; }
      return Promise.resolve(data);
    })
      .catch(error => {
        Promise.reject(error);
      });
  } catch (error) {
    Promise.reject(error)
  }
}

/**
 * Creates a valid Auth Challenge object using the returned properties from the init call.
 * @private
 * @method
 * @param {object} params - req body object
 * @returns {object} - Cognito Challenge Auth Request object.
 */
function _getChallengeRequest(body) {
  if (ReturnMock) return Promise.resolve(_challengeAuthRequestMock);

  const { CLIENT_ID, SRP_B, USERNAME, SALT, SESSION, SECRET_BLOCK } = body;
  const dateNow = getNowString();
  try {
    const srp = new SRPClient(process.env.USER_POOL_ID)
    const authKey = srp.getPasswordAuthenticationKey(USERNAME, SRP_B, SALT);
    const signature = calculateSignature(authKey, process.env.USER_POOL_ID, USERNAME, SECRET_BLOCK, dateNow);

    return Promise.resolve({
      ChallengeName: 'PASSWORD_VERIFIER',
      ClientId: CLIENT_ID,
      ChallengeResponses: {
        PASSWORD_CLAIM_SIGNATURE: signature,
        PASSWORD_CLAIM_SECRET_BLOCK: SECRET_BLOCK,
        TIMESTAMP: dateNow,
        USERNAME,
      },
      Session: SESSION,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  init,
  challenge
};
