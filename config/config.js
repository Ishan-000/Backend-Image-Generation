require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  database: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  s3: {
    bucket: process.env.S3_BUCKET,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};