import request from 'supertest';
import express from 'express';
import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import authController from './auth.controller';

describe('Login Test', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.post('/login', authController.loginWithEmail);
    });

    it('should login successfully', async () => {
        const mockUser = {
            email: 'usertest@test.com',
            password: 'testpassword'
        };

        const res = await request(app)
            .post('/login')
            .send(mockUser);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 401 because of wrong password', async () => {
        const mockUser = {
            email: 'testuser@test.com',
            password: 'password'
        };

        const res = await request(app)
            .post('/login')
            .send(mockUser);

        expect(res.status).toBe(401);
    });

    it('should return 401 because of invalid credentials', async () => {
        const mockUser = {
            email: 'test@test.com',
            password: 'password'
        };

        const res = await request(app)
            .post('/login')
            .send(mockUser);

        expect(res.status).toBe(401);
    });
})

