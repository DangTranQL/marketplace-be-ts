import request from 'supertest';
import app from '../../app';
import { describe, it, expect, beforeAll } from '@jest/globals';
import Order from '../../models/order';
import OrderItem from '../../models/orderItem';

describe('Order Controller', () => {
    beforeAll(async () => {
        await Order.deleteMany({});
    });

    describe('POST /order', () => {
        it('should create a new order', async () => {
            const res = await request(app)
                .post('/order')
                .send({
                    user: 'testuser',
                    products: [
                        {
                            product: 'testproduct',
                            quantity: 1
                        }
                    ],
                    total: 100
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('newOrder');
            expect(res.body.newOrder.user).toHaveProperty('testuser');
        });
    });

    describe('GET /order/:id', () => {
        it('should get order by id', async () => {
            const order = await Order.findOne({ user: 'testuser' });

            if (!order) {
                throw new Error('Order not found');
            }

            const res = await request(app)
                .get(`/order/${order._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('order');
            expect(res.body.order.user).toHaveProperty('testuser');
        });
    });

    describe('GET /order/search/:userID', () => {
        it('should get order by user id', async () => {
            const res = await request(app)
                .get('/order/testuser/search');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('orders');
        });
    });

    describe('PUT /order/:id', () => {
        it('should update order', async () => {
            const order = await Order.findOne({ user: 'testuser' });

            if (!order) {
                throw new Error('Order not found');
            }

            const res = await request(app)
                .put(`/order/${order._id}`)
                .send({
                    status: "processing",
                    paymentMethod: "cash"
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('order');
            expect(res.body.order.total).toBe(200);
        });
    });

    describe('PUT /order/:id/item', () => {
        it('should update order item', async () => {
            const order = await Order.findOne({ user: 'testuser' });

            if (!order) {
                throw new Error('Order not found');
            }

            const res = await request(app)
                .put(`/order/${order._id}/item`)
                .send({
                    product: 'testproduct',
                    quantity: 2
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('order');
            expect(res.body.order.total).toBe(300);
        });
    });

    describe('DELETE /order/:id', () => {
        it('should delete order by id', async () => {
            const order = await Order.findOne({ user: 'testuser' });

            if (!order) {
                throw new Error('Order not found');
            }

            const res = await request(app)
                .delete(`/order/${order._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('deletedOrder');
            expect(res.body.deletedOrder.user).toHaveProperty('testuser');
        });
    });

    describe('DELETE /order/:userID', () => {
        it('should delete order by user id', async () => {
            const order = await Order.findOne({ userID: 'testuser' });
            
            if (!order) {
                throw new Error('Order not found');
            }

            const res = await request(app)
                .delete('/order/testuser');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('deletedOrders');
        });
    });

    describe('DELETE /order/:id/item', () => {
        it('should delete order item by id', async () => {
            const order = await Order.findOne({ user: 'testuser' });

            if (!order) {
                throw new Error('Order not found');
            }

            const item = await OrderItem.findOne({ orderID: order._id, product: 'testproduct' });

            if (!item) {
                throw new Error('Item not found');
            }

            const res = await request(app)
                .delete(`/order/${order._id}/item/${item._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('deletedItem');
            expect(res.body.deletedItem.product).toHaveProperty('testproduct');
        });
    });
})
