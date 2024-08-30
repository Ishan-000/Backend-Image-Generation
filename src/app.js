const express = require('express');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const uploadRoutes = require('./api/uploadController');
const statusRoutes = require('./api/statusController');
const authRoutes = require('./api/authController');
const logger = require('./utils/logger');
const config = require('../config/config');
const { authenticate } = require('./utils/auth');

const app = express();

app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use('/api', authRoutes);
app.use('/api', authenticate, uploadRoutes);
app.use('/api', authenticate, statusRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
// });

module.exports = app;