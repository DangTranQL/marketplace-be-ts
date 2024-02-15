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
const user_1 = __importDefault(require("../../models/user"));
const order_1 = __importDefault(require("../../models/order"));
const request = (0, supertest_1.default)(app_1.default);
(0, mocha_1.describe)('User Controller', () => {
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
        yield user_1.default.deleteMany({});
    }));
    (0, mocha_1.describe)('POST /users', () => {
        (0, mocha_1.it)('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request.post('/users').send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.newUser.username).to.equal('testuser');
            (0, chai_1.expect)(res.body.data.newUser.email).to.equal('testuser@example.com');
        }));
    });
    (0, mocha_1.describe)('GET /users', () => {
        (0, mocha_1.it)('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.get('/users');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.users).to.be.an('array');
            (0, chai_1.expect)(res.body.data.users[0].username).to.equal('testuser');
            (0, chai_1.expect)(res.body.data.users[0].email).to.equal('testuser@example.com');
        }));
    });
    (0, mocha_1.describe)('GET /users/:id', () => {
        (0, mocha_1.it)('should get a user by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.get('/users/123');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.user.username).to.equal('testuser');
            (0, chai_1.expect)(res.body.data.user.email).to.equal('testuser@example.com');
        }));
    });
    (0, mocha_1.describe)('PUT /users/:id', () => {
        (0, mocha_1.it)('should update a user by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.put('/users/123').send({
                username: 'testuser2',
                email: 'testuser2@example.com',
                password: 'password123',
                role: 'buyer',
                address: '123 Test St',
                phone: '1234567890'
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.user.username).to.equal('testuser2');
            (0, chai_1.expect)(res.body.data.user.email).to.equal('testuser@example.com');
        }));
    });
    (0, mocha_1.describe)('PUT /users/:id/orders', () => {
        (0, mocha_1.it)('should create an order item', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.post('/users/123/orders').send({
                productID: '123',
                quantity: 2,
                price: 100
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.order.userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.order.status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('GET /users/:id/orders', () => {
        (0, mocha_1.it)('should get an order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            // Create an order
            yield order_1.default.create({
                userID: '123',
                status: 'pending',
                price: 0
            });
            const res = yield request.get('/users/123/orders');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.order.userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.order.status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('DELETE /users/:id', () => {
        (0, mocha_1.it)('should delete a user by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.delete('/users/123');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.user.isDeleted).to.equal(true);
        }));
    });
    (0, mocha_1.describe)('DELETE /users/:username', () => {
        (0, mocha_1.it)('should delete a user by username', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.delete('/users/testuser');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.user.isDeleted).to.equal(true);
        }));
    });
    (0, mocha_1.describe)('DELETE /users', () => {
        (0, mocha_1.it)('should delete all users', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a user
            yield user_1.default.create({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            const res = yield request.delete('/users');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.users).to.equal(1);
        }));
    });
});
