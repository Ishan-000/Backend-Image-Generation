const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const csvValidator = require('../services/csvValidator');
const requestManager = require('../services/requestManager');
const imageProcessor = require('../services/imageProcessor');
const auth = require('../utils/auth');
const logger = require('../utils/logger');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth.authenticate, upload.single('csvFile'), async (req, res) => {
  const requestId = uuidv4();

  try {
    await csvValidator.validate(req.file.path);
    await requestManager.createRequest(requestId, req.file.path);
    res.json({ requestId });

    imageProcessor.processRequest(requestId);
  } catch (error) {
    logger.error(`Error processing upload: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;