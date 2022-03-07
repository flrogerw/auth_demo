const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const ReturnMock = true;
AWS.config.region = process.env.AWS_REGION

/**
 * Mock Init Authorization Response 
 * @private
 * @constant
 * @type {object}
 */
const _initAuthResponseMock = require('../fixtures/initAuthResponse.json');

/** 
 * Mock Challenge Authorization Response
 * @private 
 * @constant
 * @type {object}
 */
const _challengeAuthResponseMock = require('../fixtures/challengeAuthResponse.json');

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
 * The USERNAME is required so there is at least one system unique identifier in the JWT.
 * @async
 * @method
 * @param {object} body - Express request body object.
 * @returns {string} - JWT containing the Cognito Authorization Object containing access token or an Error.
 */
async function challenge(body) {
  try {
    const { CLIENT_ID, USERNAME, PASSWORD_CLAIM_SIGNATURE, PASSWORD_CLAIM_SECRET_BLOCK } = body;
    const challengeRequest = {
      ChallengeName: 'PASSWORD_VERIFIER',
      ClientId: CLIENT_ID,
      ChallengeResponses: {
        PASSWORD_CLAIM_SIGNATURE,
        PASSWORD_CLAIM_SECRET_BLOCK,
        TIMESTAMP: Date.now(),
        USERNAME,
      }
    };
    const response = await _challengeAuth(challengeRequest);
    response.Username = body.USERNAME;
    // Can be used on the backend to determine if a refresh call to Cognito is needed.
    response.AuthenticationResult.ExpiresAt = Date.now() + response.AuthenticationResult.ExpiresIn;

    const token = jwt.sign(response, process.env.SECRET, { expiresIn: '1h' });
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
      if (err) { return Promise.reject(err); }
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

module.exports = {
  init,
  challenge
};
