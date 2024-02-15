import app from '../../app';
import { describe, it, before, after, afterEach } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import Order from '../../models/order';
import OrderItem from '../../models/orderItem';

const request = supertest(app);

describe('Order Controller', () => {
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
    await Order.deleteMany({});
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const res = await request.post('/orders').send({
        userID: '123',
        status: 'pending',
        paymentMethod: 'card',
      });

      expect(res.status).to.equal(200);
      expect(res.body.data.newOrder.userID).to.equal('123');
      expect(res.body.data.newOrder.status).to.equal('pending');
    });
  });

  describe('GET /orders/:id', () => {
    it('should get an order by id', async () => {
      // Create an order
      await Order.create({
        userID: '123',
        status: 'pending',
        paymentMethod: 'card',
      });

        const res = await request.get('/orders/123');

        expect(res.status).to.equal(200);
        expect(res.body.data.order.userID).to.equal('123');
        expect(res.body.data.order.status).to.equal('pending');
    });
  });

    describe('GET /orders/search/:userID', () => {
        it('should get all orders by user id', async () => {
        // Create an order
        await Order.create({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card',
        });
    
        const res = await request.get('/orders/user/123');
    
        expect(res.status).to.equal(200);
        expect(res.body.data.orders).to.be.an('array');
        expect(res.body.data.orders[0].userID).to.equal('123');
        expect(res.body.data.orders[0].status).to.equal('pending');
        });
    });

    describe('PUT /orders/:id', () => {
        it('should update an order by id', async () => {
        // Create an order
        const order = await Order.create({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card',
        });

        const res = await request.put(`/orders/${order._id}`).send({
            status: 'shipped'
        });

        expect(res.status).to.equal(200);
        expect(res.body.data.updatedOrder.status).to.equal('shipped');
        });
    });

    describe('PUT /orders/item/:id', () => {
        it('should update an order item by id', async () => {
        // Create an order
        const order = await Order.create({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card',
        });

        const orderItem = await OrderItem.create({
            productID: '789',
            quantity: 2,
            orderID: order._id
        });

        const res = await request.put(`/orders/item/${orderItem._id}`).send({
            quantity: 3
        });

        expect(res.status).to.equal(200);
        expect(res.body.data.updatedItem.quantity).to.equal(3);
        });
    });

    describe('DELETE /orders/:id', () => {
        it('should delete an order by id', async () => {
        // Create an order
        const order = await Order.create({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card',
        });

        const res = await request.delete(`/orders/${order._id}`);

        expect(res.status).to.equal(200);
        expect(res.body.data.deletedOrder.userID).to.equal('123');
        expect(res.body.data.deletedOrder.status).to.equal('pending');
        });
    });

    describe('DELETE /orders/:userID', () => {
        it('should delete all orders by user id', async () => {
        // Create an order
        await Order.create({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card',
        });

        const res = await request.delete(`/orders/user/123`);

        expect(res.status).to.equal(200);
        expect(res.body.data.deletedOrders.userID).to.equal('123');
        expect(res.body.data.deletedOrders.status).to.equal('pending');
        });
    });

    describe('DELETE /orders/:id/item', () => {
        it('should delete an order item by id', async () => {
        // Create an order
        const order = await Order.create({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card',
        });

        const orderItem = await OrderItem.create({
            productID: '789',
            quantity: 2,
            orderID: order._id
        });

        const res = await request.delete(`/orders/item/${orderItem._id}`);

        expect(res.status).to.equal(200);
        expect(res.body.data.deletedItem.productID).to.equal('789');
        expect(res.body.data.deletedItem.quantity).to.equal(2);
        });
    });
});