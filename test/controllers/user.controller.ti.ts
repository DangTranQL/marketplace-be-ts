import request from 'supertest';
import app from '../../app';
import { describe, it, expect, beforeAll } from '@jest/globals';
import User from '../../models/user';

describe('User Controller', () => {
    beforeAll(async () => {
        await User.deleteMany({});
    });

    describe('POST /user', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/user')
                .send({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    password: 'testpassword',
                    role: 'user',
                    address: '123 Test St',
                    phone: '1234567890'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('newUser');
            expect(res.body.newUser.username).toHaveProperty('testuser');
        });
    });

    describe('GET /user', () => {
        it('should get users', async () => {
            const res = await request(app)
                .get('/user');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('users');
        });

        it('should get user by username', async () => {
            const res = await request(app)
                .get('/user?username=testuser');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('users');
            expect(res.body.users[0].username).toHaveProperty('testuser');
        });
    });

    describe('GET /user/:id', () => {
        it('should get user by id', async () => {
            const user = await User.findOne({ username: 'testuser' });

            if (!user) {
                throw new Error('User not found');
            }

            const res = await request(app)
                .get(`/user/${user._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.username).toHaveProperty('testuser');
        });
    });

    describe('PUT /user/:id', () => {
        it('should create an order item', async () => {
            const user = await User.findOne({ username: 'testuser' });

            if (!user) {
                throw new Error('User not found');
            }

            const res = await request(app)
                .put(`/user/${user._id}`)
                .send({
                    productID: 'testproductid',
                    quantity: 1,
                    price: 100
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('order');
            expect(res.body.order.userID).toHaveProperty(user._id);
        });
    });

    describe('GET /user/:id/orders', () => {
        it('should get user orders', async () => {
            const user = await User.findOne({ username: 'testuser' });

            if (!user) {
                throw new Error('User not found');
            }

            const res = await request(app)
                .get(`/user/${user._id}/orders`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('orders');
            expect(res.body.order.userID).toHaveProperty(user._id);
        });
    });

    describe('DELETE /user/:id', () => {
        it('should delete user by id', async () => {
            const user = await User.findOne({ username: 'testuser' });

            if (!user) {
                throw new Error('User not found');
            }

            const res = await request(app)
                .delete(`/user/${user._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.username).toHaveProperty('testuser');
        });
    });

    describe('DELETE /user/:username', () => {
        it('should delete user by username', async () => {
            const res = await request(app)
                .delete('/user/testuser');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.username).toHaveProperty('testuser');
        });
    });

    describe('DELETE /user', () => {
        it('should delete all users', async () => {
            const res = await request(app)
                .delete('/user');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('users');
        });
    });
})

