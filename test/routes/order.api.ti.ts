import request from 'supertest';
import express from 'express';
import router from '../../routes/order.api';

const app = express();
app.use(express.json());
app.use('/', router);

describe('Order API', () => {
    it('should respond with a 200 status code for succesfully create a new order', async () => {
        const res = await request(app)
        .post('/')
        .send({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card'
        });
        expect(res.status).toEqual(200);
        expect(res.body.data).toHaveProperty('orderID');
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const res = await request(app)
        .post('/')
        .send({
            userID: '123',
            status: 'pending'
        });
        expect(res.status).toEqual(400);
    });

    it('should respond with a 200 status code for successfully getting an order by id', async () => {
        const res = await request(app)
        .get('/789');
        expect(res.status).toEqual(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const res = await request(app)
        .get('/abc');
        expect(res.status).toEqual(400);
    });
    
    it('should respond with a 200 status code for successfully getting an order by user id', async () => {
        const res = await request(app)
        .get('/search/123');
        expect(res.status).toEqual(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const res = await request(app)
        .get('/search/abc');
        expect(res.status).toEqual(400);
    });

    it('should respond with a 200 status code for successfully updating an order', async () => {
        const res = await request(app)
        .put('/789')
        .send({
            status: 'completed'
        });
        expect(res.status).toEqual(200);
    });  

    it('should respond with a 400 status code for validation errors', async () => {
        const res = await request(app)
        .put('/789')
        .send({
            status: 'arriving'
        });
        expect(res.status).toEqual(400);
    });

    it('should respond with a 200 status code for successfully updating an item', async () => {
        const res = await request(app)
        .put('/item/789')
        .send({
            itemID: '456',
            quantity: 2,
            price: 20
        });
        expect(res.status).toEqual(200);
    });

    it('should respond with a 400 status code for validation errors', async () => {
        const res = await request(app)
        .put('/item/789')
        .send({
            itemID: 'abc',
            quantity: 2,
            price: 20
        });
        expect(res.status).toEqual(400);
    });
});