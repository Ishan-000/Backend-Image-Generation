const db = require('./databaseService');
const logger = require('../utils/logger');

exports.createRequest = async (requestId, filePath) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO requests (id, status, created_at, updated_at) VALUES ($1, $2, $3, $3)', 
      [requestId, 'PENDING', new Date()]);

    const csvData = await require('./csvValidator').validate(filePath);
    const productInserts = [];
    const imageInserts = [];

    for (const row of csvData) {
      productInserts.push({
        text: 'INSERT INTO products (request_id, serial_number, name, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
        values: [requestId, row['S. No.'], row['Product Name'], new Date()]
      });
    }

    const productResults = await Promise.all(productInserts.map(query => client.query(query.text, query.values)));

    productResults.forEach((result, index) => {
      const productId = result.rows[0].id;
      const urls = csvData[index]['Input Image Urls'].split(',');
      urls.forEach(url => {
        imageInserts.push({
          text: 'INSERT INTO images (product_id, input_url, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)',
          values: [productId, url.trim(), 'PENDING', new Date()]
        });
      });
    });

    await Promise.all(imageInserts.map(query => client.query(query.text, query.values)));

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error creating request: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};


exports.getRequestStatus = async (requestId) => {
  const result = await db.query(`
    SELECT r.status as request_status, 
           COUNT(CASE WHEN i.status = 'PROCESSED' THEN 1 END) as processed_images,
           COUNT(i.id) as total_images
    FROM requests r
    LEFT JOIN products p ON r.id = p.request_id
    LEFT JOIN images i ON p.id = i.product_id
    WHERE r.id = $1
    GROUP BY r.id, r.status
  `, [requestId]);

  if (result.rows.length === 0) {
    logger.warn(`Request not found: ${requestId}`);
    throw new Error('Request not found');
  }
  return result.rows[0];
};