import request from 'supertest';
import express from 'express';
import router from '../../routes/user.api';

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST / - User Registration', () => {
    it('should respond with a 200 status code for successful registration', async () => {
        const response = await request(app)
        .post('/')
        .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St',
            phone: 1234567890
            });

        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const response = await request(app)
        .post('/')
        .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St'
            });

        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 200 status code for successfully getting all users', async () => {
        const response = await request(app)
        .get('/');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 200 status code for successfully getting a user by id', async () => {
        const response = await request(app)
        .get('/123');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const response = await request(app)
        .get('/abc');

        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 200 status code for successully getting orders by user id', async () => {
        const response = await request(app)
        .get('/123/orders');

        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const response = await request(app)
        .get('/abc/orders');

        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 200 status code for successfully updating a user by id', async () => {
        const response = await request(app)
        .put('/123')
        .send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St',
            phone: 1234567890
            });

        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const response = await request(app)
        .put('/abc')
        .send({
            username: 'testuser',
        });
    });

    it('should respond with a 200 status code for successfully creating an order item', async () => {
        const response = await request(app)
        .put('/123/orders')
        .send({
            productID: '456',
            quantity: 1,
            price: 100
            });

        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const response = await request(app)
        .put('/abc/orders')
        .send({
            productID: '123',
            quantity: 1,
            });

        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 200 status code for successfully getting an order by user id', async () => {
        const response = await request(app)
        .get('/123/orders');

        expect(response.statusCode).toBe(200);
    });

});
