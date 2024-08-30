const express = require('express');
const requestManager = require('../services/requestManager');
const auth = require('../utils/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/status/:requestId', auth.authenticate, async (req, res) => {
  try {
    const status = await requestManager.getRequestStatus(req.params.requestId);
    res.json(status);
  } catch (error) {
    logger.error(`Error retrieving status: ${error.message}`);
    res.status(404).json({ error: 'Request not found' });
  }
});

module.exports = router;
