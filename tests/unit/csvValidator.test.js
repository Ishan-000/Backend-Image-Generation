const { validate } = require('../../src/services/csvValidator');
const fs = require('fs');
const path = require('path');

jest.mock('fs');
jest.mock('../../src/utils/logger');

describe('CSV Validator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate a correct CSV file', async () => {
    const mockCSV = `S. No.,Product Name,Input Image Urls
1,Product1,http://example.com/image1.jpg,http://example.com/image2.jpg
2,Product2,http://example.com/image3.jpg`;

    fs.createReadStream.mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'data') {
          callback({
            'S. No.': '1',
            'Product Name': 'Product1',
            'Input Image Urls': 'http://example.com/image1.jpg,http://example.com/image2.jpg'
          });
          callback({
            'S. No.': '2',
            'Product Name': 'Product2',
            'Input Image Urls': 'http://example.com/image3.jpg'
          });
        }
        if (event === 'end') {
          callback();
        }
        return this;
      })
    });

    await expect(validate('mockPath')).resolves.not.toThrow();
  });

  it('should reject an incorrect CSV file', async () => {
    fs.createReadStream.mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'data') {
          callback({
            'S. No.': '1',
            'Product Name': 'Product1',
            'Input Image Urls': 'not-a-url'
          });
        }
        if (event === 'end') {
          callback();
        }
        return this;
      })
    });

    await expect(validate('mockPath')).rejects.toThrow('Invalid CSV structure');
  });
});