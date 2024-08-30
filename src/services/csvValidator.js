const csv = require('csv-parser');
const fs = require('fs');
const logger = require('../utils/logger');

exports.validate = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (validateStructure(results)) {
          resolve(results);
        } else {
          logger.warn(`Invalid CSV structure for file: ${filePath}`);
          reject(new Error('Invalid CSV structure'));
        }
      });
  });
};

function validateStructure(results) {
  return results.every(row => 
    row['S. No.'] && 
    row['Product Name'] && 
    row['Input Image Urls'] &&
    row['Input Image Urls'].split(',').every(url => url.trim().startsWith('http'))
  );
}