const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const logger = require('./logger');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  logger.info(`Auth header: ${authHeader}`);

  if (!authHeader) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
      logger.warn('Authentication failed: Token error');
      return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
      logger.warn('Authentication failed: Token malformatted');
      return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.info(`Token verified for user ID: ${decoded.id}`);
      req.userId = decoded.id;
      next();
  } catch (error) {
      logger.warn(`Authentication failed: ${error.message}`);
      res.status(401).json({ error: 'Invalid token' });
  }
};

