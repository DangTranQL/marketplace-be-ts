import request from 'supertest';
import express from 'express';
import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import userController from './user.controller';

jest.mock('../models/user');

describe('Create User Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/users', userController.createUser);
    });

    it('should create a new user', async () => {
        const mockUser = {
        username: 'testuser',
        email: 'testuser@test.com',
        password: 'testpassword',
        role: 'buyer',
        address: 'test address',
        phone: 1234567890
        };

        const res = await request(app)
        .post('/users')
        .send(mockUser);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('username', mockUser.username);
        expect(res.body).toHaveProperty('email', mockUser.email);
        expect(res.body).toHaveProperty('role', mockUser.role);
        expect(res.body).toHaveProperty('address', mockUser.address);
        expect(res.body).toHaveProperty('phone', mockUser.phone);
    });

    it('should return 400 because of invalid format', async () => {
        const mockUser = {
            username: 123,
            email: 'testuser@test.com',
            password: 'testpassword',
            role: 'buyer',
            address: 'test address',
            phone: 1234567890
        };

        const res = await request(app)
            .post('/users')
            .send(mockUser);

        expect(res.status).toBe(400);
    });

    it('should return 400 because of missing fields', async () => {
        const mockUser = {
            username: 'testuser2',
            email: 'testuser2@test.com',
            password: 'testpassword'
        };

        const res = await request(app)
            .post('/users')
            .send(mockUser);

        expect(res.status).toBe(400);
    });

    it('should return 400 because user already exists', async () => {
        const mockUser = {
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'testpassword',
            role: 'buyer',
            address: 'test address',
            phone: 1234567890
        };

        const res = await request(app)
            .post('/users')
            .send(mockUser);

        expect(res.status).toBe(400);
    });
});

describe('Get Users Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.get('/users', userController.getUsers);
    });

    it('should get all users', async () => {
        const res = await request(app)
            .get('/users');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('users');
    });

    it('should get user with username', async () => {
        const res = await request(app)
            .get('/users?username=testuser');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('users');
    });

    it('should return 400 because of invalid query', async () => {
        const res = await request(app)
            .get('/users?limit=invalid');

        expect(res.status).toBe(400);
    });
});

describe('Get User By Id Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.get('/users/:id', userController.getUserById);
    });

    it('should get user by id', async () => {
        const res = await request(app)
            .get('/users/123');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
    });

    it('should return 404 because user not found', async () => {
        const res = await request(app)
            .get('/users/123');

        expect(res.status).toBe(404);
    });
});

describe('Create Order Item Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.put('/users/:id', userController.createOrderItem);
    });

    it('should create order item', async () => {
        const res = await request(app)
            .put('/users/123')
            .send({
                productID: '123',
                quantity: 2,
                price: 100
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('order');
    });
});

describe('Get Order Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.get('/users/:id/orders', userController.getOrder);
    });

    it('should get order', async () => {
        const res = await request(app)
            .get('/users/123/orders');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('order');
        expect(res.body).toHaveProperty('orderItems');
    });

    it('should return 404 because order not found', async () => {
        const res = await request(app)
            .get('/users/123/orders');

        expect(res.status).toBe(404);
    });
});

describe('Delete User By Id Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.delete('/users/:id', userController.deleteUserById);
    });

    it('should delete user by id', async () => {
        const res = await request(app)
            .delete('/users/123');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
    });

    it('should return 404 because user not found', async () => {
        const res = await request(app)
            .delete('/users/123');

        expect(res.status).toBe(404);
    });
});

describe('Delete User By Username Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.delete('/users/:username', userController.deleteUserByUsername);
    });

    it('should delete user by username', async () => {
        const res = await request(app)
            .delete('/users/testuser');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
    });

    it('should return 404 because user not found', async () => {
        const res = await request(app)
            .delete('/users/testuser456');

        expect(res.status).toBe(404);
    });
});

describe('Delete All Users Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.delete('/users', userController.deleteAllUsers);
    });

    it('should delete all users', async () => {
        const res = await request(app)
            .delete('/users');

        expect(res.status).toBe(200);
    });
});