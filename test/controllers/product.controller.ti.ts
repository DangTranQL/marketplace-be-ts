import request from 'supertest';
import app from '../../app';
import { describe, it, expect, beforeAll } from '@jest/globals';
import Product from '../../models/product';

describe('Product Controller', () => {
    beforeAll(async () => {
        await Product.deleteMany({});
    });

    describe('POST /product', () => {
        it('should create a new product', async () => {
            const res = await request(app)
                .post('/product')
                .send({
                    name: 'testproduct',
                    description: 'testdescription',
                    price: 100,
                    stock: 100
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('newProduct');
            expect(res.body.newProduct.name).toHaveProperty('testproduct');
        });
    });

    describe('GET /product', () => {
        it('should get products', async () => {
            const res = await request(app)
                .get('/product');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
        });

        it('should get product by title', async () => {
            const res = await request(app)
                .get('/product?title=testproduct');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
            expect(res.body.products[0].name).toHaveProperty('testproduct');
        });

        it('should get product by category', async () => {
            const res = await request(app)
                .get('/product?category=testcategory');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
        });
    });

    describe('GET /product/:id', () => {
        it('should get product by id', async () => {
            const product = await Product.findOne({ name: 'testproduct' });

            if (!product) {
                throw new Error('Product not found');
            }

            const res = await request(app)
                .get(`/product/${product._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('product');
            expect(res.body.product.name).toHaveProperty('testproduct');
        });
    });

    describe('DELETE /product/:id', () => {
        it('should delete product by id', async () => {
            const product = await Product.findOne({ name: 'testproduct' });

            if (!product) {
                throw new Error('Product not found');
            }

            const res = await request(app)
                .delete(`/product/${product._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('deletedProduct');
            expect(res.body.deletedProduct.name).toHaveProperty('testproduct');
        });
    });

    describe('DELETE /product/:title', () => {
        it('should delete product by title', async () => {
            const res = await request(app)
                .delete('/product/testproduct');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('deletedProduct');
            expect(res.body.deletedProduct.name).toHaveProperty('testproduct');
        });
    });

    describe('DELETE /product', () => {
        it('should delete all products', async () => {
            const res = await request(app)
                .delete('/product');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('products');
        });
    });
})