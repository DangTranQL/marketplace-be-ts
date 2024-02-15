import app from '../../app';
import { describe, it, before, after, afterEach } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import Product from '../../models/product';

const request = supertest(app);

describe('Product Controller', () => {
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
        await Product.deleteMany({});
    });
    
    describe('POST /products', () => {
        it('should create a new product', async () => {
        const res = await request.post('/products').send({
            name: 'testproduct',
            description: 'test description',
            price: 10.99,
            category: 'test category',
            stocks: 10,
            image: 'testimage'
        });
    
        expect(res.status).to.equal(200);
        expect(res.body.data.newProduct.name).to.equal('testproduct');
        expect(res.body.data.newProduct.description).to.equal('test description');
        });
    });
    
    describe('GET /products', () => {
        it('should get all products', async () => {
        // Create a product
        await Product.create({
            name: 'testproduct',
            description: 'test description',
            price: 10.99,
            category: 'test category',
            stocks: 10,
            image: 'testimage'
        });
    
        const res = await request.get('/products');
    
        expect(res.status).to.equal(200);
        expect(res.body.data.products).to.be.an('array');
        expect(res.body.data.products[0].name).to.equal('testproduct');
        });
    });
    
    describe('GET /products/:id', () => {
        it('should get a product by id', async () => {
        // Create a product
        const product = await Product.create({
            name: 'testproduct',
            description: 'test description',
            price: 10.99,
            category: 'test category',
            stocks: 10,
            image: 'testimage'
        });
    
        const res = await request.get(`/products/${product._id}`);
    
        expect(res.status).to.equal(200);
        expect(res.body.data.product.name).to.equal('testproduct');
        });
    });
    
    describe('PUT /products/:id', () => {
        it('should update a product by id', async () => {
        // Create a product
        const product = await Product.create({
            name: 'testproduct',
            description: 'test description',
            price: 14.00,
            category: 'test category',
            stocks: 10,
            image: 'testimage'
        });

        const res = await request.put(`/products/${product._id}`).send({
            price: 15.00
        });

        expect(res.status).to.equal(200);
        expect(res.body.data.product.price).to.equal(15.00);
        });
    });

    describe('DELETE /products/:id', () => {
        it('should delete a product by id', async () => {
        // Create a product
        const product = await Product.create({
            name: 'testproduct',
            description: 'test description',
            price: 14.00,
            category: 'test category',
            stocks: 10,
            image: 'testimage'
        });

        const res = await request.delete(`/products/${product._id}`);

        expect(res.status).to.equal(200);
        expect(res.body.data.product.isDeleted).to.equal(true);
        });
    });

    describe('DELETE /products', () => {
        it('should delete all products', async () => {
        // Create a product
        await Product.create({
            name: 'testproduct',
            description: 'test description',
            price: 14.00,
            category: 'test category',
            stocks: 10,
            image: 'testimage'
        });

        const res = await request.delete(`/products`);

        expect(res.status).to.equal(200);
        expect(res.body.data.products).to.equal(1);
        });
    });
});