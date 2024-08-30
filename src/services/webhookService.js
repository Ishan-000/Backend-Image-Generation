const crypto = require('crypto');

function generateSignature(secret, payload) {
  return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
}

exports.trigger = async (url, data) => {
  const secret = config.webhook.secret; // Store the secret in your config/env
  const signature = generateSignature(secret, data);

  try {
    await axios.post(url, data, {
      headers: {
        'X-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    logger.info(`Webhook triggered successfully: ${url}`);
  } catch (error) {
    logger.error(`Error triggering webhook: ${error.message}`);
  }
};
