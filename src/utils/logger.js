const axios = require('axios');
const os = require('os');

const env = process.env.NODE_ENV;
const noLogs = ['test', 'dev'];

/**
* Class for sending data/error logs to Datadog logging service.  Sends to STDOUT in dev mode.
* @class
* @param status Status of the data (ok, info, error, etc...)
* @param log Data to be logged
*/
class DataDogLogs {
  /**
   * @constructor
   * @param {string} status - Status of the call, ok. info, error. 
   * @param {*} log - Message from the service
   */
  constructor(status, log) {
    this.payload = {
      ddsource: "nelnet",
      ddtags: `env:${env}, app:api`,
      hostname: os.hostname(),
      service: "authorization-api",
      status,
      message: log
    };
  }

/**
 * Returns DataDogLogs class payload.
 * @private
 * @method
 * @returns {object} - DataDogLogs payload object.
*/
  _getPayload() {
    return this.payload;
  }
}

/**
* Returns OK response object.
* @method
* @param {object} req - Express request object
* @param {object} response - Successful response object.
* @returns {object} - DataDogLogs payload object.
*/
function getOkResponse(req, response) {
  const request = (Object.keys(req.body).length !== 0) ? req.body: req.query;
  const log = {
    path: req.originalUrl,
    method: req.method,
    request: JSON.stringify(request) || null,
    response: JSON.stringify(response),
    created: Math.round(Date.now() / 1000)
  };
  const dd = new DataDogLogs('ok', log);
  return dd._getPayload();
}

/**
* Returns INFO response object.
* @method
* @param req Express request object
* @param response Successful response object.
* @returns {object} - DataDogLogs payload object.
*/
function getInfoResponse(req, response) {
  const request = (Object.keys(req.body).length !== 0) ? req.body: req.query;
  const log = {
    path: req.originalUrl,
    method: req.method,
    request: JSON.stringify(request) || null,
    response: JSON.stringify(response),
    created: Math.round(Date.now() / 1000)
  };
  const dd = new DataDogLogs('info', log);
  return dd._getPayload();
}

/**
* Returns Error response object.
* @method
* @param error Error response object.
* @param req Express request object
* @returns {object} - DataDogLogs payload object.
*/
function getErrorResponse(error, req) {
  const request = (Object.keys(req.body).length !== 0) ? req.body: req.query;
  const log = {
    path: req.originalUrl,
    method: req.method,
    request: JSON.stringify(request) || null,
    response: JSON.stringify(error),
    created: Math.round(Date.now() / 1000)
  };
  const dd = new DataDogLogs('error', log);
  return dd._getPayload();
}

/**
* Send log object to DataDog using Axios.  Prints to STDOUT in dev mode.
* @method
* @param {object} data - Error response object.
* @returns {promise} - Axios promise or Logger object if running locally.
*/
function log(data) {
  const config = {
    method: 'post',
    data,
    headers: {
      'DD-API-KEY': process.env.DD_API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (noLogs.includes(env)) {
    console.error(data);
    return Promise.resolve();
  }
  return axios(process.env.DD_API_URL, config);
}

module.exports = {
  getOkResponse,
  getErrorResponse,
  getInfoResponse,
  log
};
