const sharp = require('sharp');
const axios = require('axios');
const db = require('./databaseService');
const s3 = require('./s3Service');
const logger = require('../utils/logger');
const webhook = require('./webhookService');

exports.processRequest = async (requestId) => {
  const images = await db.query('SELECT * FROM images WHERE product_id IN (SELECT id FROM products WHERE request_id = $1)', [requestId]);

  for (const image of images.rows) {
    await processImage(image);
  }

  await db.query('UPDATE requests SET status = $1, updated_at = $2 WHERE id = $3', ['COMPLETED', new Date(), requestId]);

  const webhookUrl = await db.query('SELECT webhook_url FROM requests WHERE id = $1', [requestId]);
  if (webhookUrl.rows[0] && webhookUrl.rows[0].webhook_url) {
    await webhook.trigger(webhookUrl.rows[0].webhook_url, { requestId, status: 'COMPLETED' });
  }

  await generateOutputCSV(requestId);
};

async function processImage(image, retryCount = 3) {
  try {
    const response = await axios.get(image.input_url, { responseType: 'arraybuffer' });
    const compressedImage = await sharp(response.data)
      .jpeg({ quality: 50 })
      .toBuffer();

    const outputKey = `compressed/${image.id}.jpg`;
    await s3.uploadImage(outputKey, compressedImage);
    const outputUrl = await s3.getSignedUrl(outputKey);

    await db.query('UPDATE images SET output_url = $1, status = $2, updated_at = $3 WHERE id = $4', 
      [outputUrl, 'PROCESSED', new Date(), image.id]);
  } catch (error) {
    if (retryCount > 0) {
      logger.warn(`Retrying image ${image.id} processing. Attempts remaining: ${retryCount}`);
      await processImage(image, retryCount - 1);
    } else {
      logger.error(`Failed to process image ${image.id} after retries: ${error.message}`);
      await db.query('UPDATE images SET status = $1, updated_at = $2 WHERE id = $3', 
        ['ERROR', new Date(), image.id]);
    }
  }
}


async function generateOutputCSV(requestId, options = { delimiter: ',', includeHeaders: true }) {
  const data = await db.query(`
    SELECT p.serial_number as "S. No.", p.name as "Product Name", 
           string_agg(i.input_url, ',') as "Input Image Urls",
           string_agg(i.output_url, ',') as "Output Image Urls"
    FROM products p
    JOIN images i ON p.id = i.product_id
    WHERE p.request_id = $1
    GROUP BY p.id, p.serial_number, p.name
    ORDER BY p.serial_number
  `, [requestId]);

  const csv = require('csv-stringify');
  const outputPath = `output/${requestId}.csv`;

  return new Promise((resolve, reject) => {
    csv.stringify(data.rows, { header: options.includeHeaders, delimiter: options.delimiter }, (err, output) => {
      if (err) {
        logger.error(`Error generating output CSV: ${err.message}`);
        reject(err);
      } else {
        require('fs').writeFile(outputPath, output, (err) => {
          if (err) {
            logger.error(`Error writing output CSV: ${err.message}`);
            reject(err);
          } else {
            resolve(outputPath);
          }
        });
      }
    });
  });
}
