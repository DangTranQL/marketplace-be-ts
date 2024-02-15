import app from '../../app';
import { describe, it, before, after, afterEach } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import User from '../../models/user';
import Order from '../../models/order';

const request = supertest(app);

describe('User Controller', () => {
    before(async () => {
        // Connect to a test database
        await mongoose.connect('mongodb://localhost/test');
      });

  after(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const res = await request.post('/users').send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
        role: 'user',
        address: '123 Test St',
        phone: '1234567890'
      });

      expect(res.status).to.equal(200);
      expect(res.body.data.newUser.username).to.equal('testuser');
      expect(res.body.data.newUser.email).to.equal('testuser@example.com');
    });
  });

  describe('GET /users', () => {
    it('should get all users', async () => {
      // Create a user
      await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
        role: 'user',
        address: '123 Test St',
        phone: '1234567890'
      });

      const res = await request.get('/users');

      expect(res.status).to.equal(200);
      expect(res.body.data.users).to.be.an('array');
      expect(res.body.data.users[0].username).to.equal('testuser');
      expect(res.body.data.users[0].email).to.equal('testuser@example.com');
    });
  });

    describe('GET /users/:id', () => {
        it('should get a user by id', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        const res = await request.get('/users/123');

        expect(res.status).to.equal(200);
        expect(res.body.data.user.username).to.equal('testuser');
        expect(res.body.data.user.email).to.equal('testuser@example.com');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a user by id', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        const res = await request.put('/users/123').send({
            username: 'testuser2',
            email: 'testuser2@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St',
            phone: '1234567890'
        });

        expect(res.status).to.equal(200);
        expect(res.body.data.user.username).to.equal('testuser2');
        expect(res.body.data.user.email).to.equal('testuser@example.com');
        });
    });

    describe('PUT /users/:id/orders', () => {
        it('should create an order item', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        const res = await request.post('/users/123/orders').send({
            productID: '123',
            quantity: 2,
            price: 100
        });

        expect(res.status).to.equal(200);
        expect(res.body.data.order.userID).to.equal('123');
        expect(res.body.data.order.status).to.equal('pending');
        });
    });

    describe('GET /users/:id/orders', () => {
        it('should get an order by user id', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        // Create an order
        await Order.create({
            userID: '123',
            status: 'pending',
            price: 0
        });

        const res = await request.get('/users/123/orders');

        expect(res.status).to.equal(200);
        expect(res.body.data.order.userID).to.equal('123');
        expect(res.body.data.order.status).to.equal('pending');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user by id', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        const res = await request.delete('/users/123');

        expect(res.status).to.equal(200);
        expect(res.body.data.user.isDeleted).to.equal(true);
        });
    });

    describe('DELETE /users/:username', () => {
        it('should delete a user by username', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        const res = await request.delete('/users/testuser');

        expect(res.status).to.equal(200);
        expect(res.body.data.user.isDeleted).to.equal(true);
        });
    });

    describe('DELETE /users', () => {
        it('should delete all users', async () => {
        // Create a user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'user',
            address: '123 Test St',
            phone: '1234567890'
        });

        const res = await request.delete('/users');

        expect(res.status).to.equal(200);
        expect(res.body.data.users).to.equal(1);
        });
    });
});