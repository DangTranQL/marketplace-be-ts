import request from 'supertest';
import express from 'express';
import router from '../../routes/auth.api';

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST / - User Login', () => {
  it('should respond with a 200 status code for successful login', async () => {
    const response = await request(app)
      .post('/')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
  });

  it('should respond with a 400 status code for validation errors', async () => {
    const response = await request(app)
      .post('/')
      .send({
        email: 'test',
        password: 'password123'
      });

    expect(response.statusCode).toBe(400);
  });
});