const request = require('supertest');
const app = require('../app');

describe('HTTP API tests', () => {
  test('GET / should return API status', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'REST API is running' });
  });

  test('GET /api/gobi should require authentication', async () => {
    const response = await request(app).get('/api/gobi');
    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token is missing' });
  });

  test('POST /api/gobi/doc should require authentication', async () => {
    const response = await request(app)
      .post('/api/gobi/doc')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token is missing' });
  });
});
