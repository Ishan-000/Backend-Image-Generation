const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const config = require('../../config/config');
const logger = require('../utils/logger');

const s3Client = new S3Client(config.aws);

exports.uploadImage = async (key, body) => {
  try {
    const command = new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: body
    });
    return await s3Client.send(command);
  } catch (err) {
    logger.error(`Error uploading to S3: ${err.message}`);
    throw err;
  }
};

exports.getSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
};