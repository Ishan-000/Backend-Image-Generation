const axios = require('axios');
const logger = require('../utils/logger');

exports.trigger = async (url, data) => {
  try {
    await axios.post(url, data);
    logger.info(`Webhook triggered successfully: ${url}`);
  } catch (error) {
    logger.error(`Error triggering webhook: ${error.message}`);
  }
};