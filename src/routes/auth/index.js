const express = require('express');
const authService = require('../../services/auth');
const { getErrorResponse, getOkResponse, log } = require('../../utils/logger');
const { getError } = require('../../utils/error-handler');

const router = express.Router();

/**
 * Cognito Init Authorization Route
 */
router.post('/init', async (req, res) => {
  try {
    const response = await authService.init(req.body);
    log(getOkResponse(req, response))
    res.status(200).send(response);
  } catch (error) {
    const e = getError(error);
    log(getErrorResponse(error, req))
    res.status(e.status).json(e.error);
  }
});

/**
 * Cognito Challenge Authorization Route
 */
router.post('/challenge', async (req, res) => {
  try {
    const response = await authService.challenge(req.body);
    log(getOkResponse(req, response))
    res.status(200).send(response);
  } catch (error) {
    const e = getError(error);
    log(getErrorResponse(error, req))
    res.status(e.status).json(e.error);
  }
});

module.exports = router;
