const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const csvValidator = require('../../src/services/csvValidator');
const requestManager = require('../../src/services/requestManager');
const imageProcessor = require('../../src/services/imageProcessor');

jest.mock('../../src/services/csvValidator');
jest.mock('../../src/services/requestManager');
jest.mock('../../src/services/imageProcessor');

describe('Upload API', () => {
  let token;

  beforeEach(() => {
    token = jwt.sign({ id: 'testuser' }, config.jwtSecret);
    csvValidator.validate.mockResolvedValue(true);
    requestManager.createRequest.mockResolvedValue(true);
    imageProcessor.processRequest.mockResolvedValue(true);
  });

  it('should upload a CSV file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', token)
      .attach('csvFile', Buffer.from('mock csv content'), 'test.csv');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('requestId');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('csvFile', Buffer.from('mock csv content'), 'test.csv');

    expect(response.statusCode).toBe(401);
  });

  it('should return 400 if CSV validation fails', async () => {
    csvValidator.validate.mockRejectedValue(new Error('Invalid CSV'));

    const response = await request(app)
      .post('/api/upload')
      .set('Authorization', token)
      .attach('csvFile', Buffer.from('invalid csv content'), 'test.csv');

    expect(response.statusCode).toBe(400);
  });
});
