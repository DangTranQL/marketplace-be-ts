"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../app"));
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_1 = __importDefault(require("../../models/product"));
const request = (0, supertest_1.default)(app_1.default);
(0, mocha_1.describe)('Product Controller', () => {
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Connect to a test database
        yield mongoose_1.default.connect('mongodb://localhost/test');
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Disconnect from the test database
        yield mongoose_1.default.disconnect();
    }));
    (0, mocha_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up the database after each test
        yield product_1.default.deleteMany({});
    }));
    (0, mocha_1.describe)('POST /products', () => {
        (0, mocha_1.it)('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request.post('/products').send({
                name: 'testproduct',
                description: 'test description',
                price: 10.99,
                category: 'test category',
                stocks: 10,
                image: 'testimage'
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.newProduct.name).to.equal('testproduct');
            (0, chai_1.expect)(res.body.data.newProduct.description).to.equal('test description');
        }));
    });
    (0, mocha_1.describe)('GET /products', () => {
        (0, mocha_1.it)('should get all products', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a product
            yield product_1.default.create({
                name: 'testproduct',
                description: 'test description',
                price: 10.99,
                category: 'test category',
                stocks: 10,
                image: 'testimage'
            });
            const res = yield request.get('/products');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.products).to.be.an('array');
            (0, chai_1.expect)(res.body.data.products[0].name).to.equal('testproduct');
        }));
    });
    (0, mocha_1.describe)('GET /products/:id', () => {
        (0, mocha_1.it)('should get a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a product
            const product = yield product_1.default.create({
                name: 'testproduct',
                description: 'test description',
                price: 10.99,
                category: 'test category',
                stocks: 10,
                image: 'testimage'
            });
            const res = yield request.get(`/products/${product._id}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.product.name).to.equal('testproduct');
        }));
    });
    (0, mocha_1.describe)('PUT /products/:id', () => {
        (0, mocha_1.it)('should update a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a product
            const product = yield product_1.default.create({
                name: 'testproduct',
                description: 'test description',
                price: 14.00,
                category: 'test category',
                stocks: 10,
                image: 'testimage'
            });
            const res = yield request.put(`/products/${product._id}`).send({
                price: 15.00
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.product.price).to.equal(15.00);
        }));
    });
    (0, mocha_1.describe)('DELETE /products/:id', () => {
        (0, mocha_1.it)('should delete a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a product
            const product = yield product_1.default.create({
                name: 'testproduct',
                description: 'test description',
                price: 14.00,
                category: 'test category',
                stocks: 10,
                image: 'testimage'
            });
            const res = yield request.delete(`/products/${product._id}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.product.isDeleted).to.equal(true);
        }));
    });
    (0, mocha_1.describe)('DELETE /products', () => {
        (0, mocha_1.it)('should delete all products', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a product
            yield product_1.default.create({
                name: 'testproduct',
                description: 'test description',
                price: 14.00,
                category: 'test category',
                stocks: 10,
                image: 'testimage'
            });
            const res = yield request.delete(`/products`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.products).to.equal(1);
        }));
    });
});
