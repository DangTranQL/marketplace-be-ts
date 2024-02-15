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
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const request = (0, supertest_1.default)(app_1.default);
(0, mocha_1.describe)('Order Controller', () => {
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
        yield order_1.default.deleteMany({});
    }));
    (0, mocha_1.describe)('POST /orders', () => {
        (0, mocha_1.it)('should create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request.post('/orders').send({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.newOrder.userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.newOrder.status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('GET /orders/:id', () => {
        (0, mocha_1.it)('should get an order by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const res = yield request.get('/orders/123');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.order.userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.order.status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('GET /orders/search/:userID', () => {
        (0, mocha_1.it)('should get all orders by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const res = yield request.get('/orders/user/123');
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.orders).to.be.an('array');
            (0, chai_1.expect)(res.body.data.orders[0].userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.orders[0].status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('PUT /orders/:id', () => {
        (0, mocha_1.it)('should update an order by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            const order = yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const res = yield request.put(`/orders/${order._id}`).send({
                status: 'shipped'
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.updatedOrder.status).to.equal('shipped');
        }));
    });
    (0, mocha_1.describe)('PUT /orders/item/:id', () => {
        (0, mocha_1.it)('should update an order item by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            const order = yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const orderItem = yield orderItem_1.default.create({
                productID: '789',
                quantity: 2,
                orderID: order._id
            });
            const res = yield request.put(`/orders/item/${orderItem._id}`).send({
                quantity: 3
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.updatedItem.quantity).to.equal(3);
        }));
    });
    (0, mocha_1.describe)('DELETE /orders/:id', () => {
        (0, mocha_1.it)('should delete an order by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            const order = yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const res = yield request.delete(`/orders/${order._id}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.deletedOrder.userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.deletedOrder.status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('DELETE /orders/:userID', () => {
        (0, mocha_1.it)('should delete all orders by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const res = yield request.delete(`/orders/user/123`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.deletedOrders.userID).to.equal('123');
            (0, chai_1.expect)(res.body.data.deletedOrders.status).to.equal('pending');
        }));
    });
    (0, mocha_1.describe)('DELETE /orders/:id/item', () => {
        (0, mocha_1.it)('should delete an order item by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create an order
            const order = yield order_1.default.create({
                userID: '123',
                status: 'pending',
                paymentMethod: 'card',
            });
            const orderItem = yield orderItem_1.default.create({
                productID: '789',
                quantity: 2,
                orderID: order._id
            });
            const res = yield request.delete(`/orders/item/${orderItem._id}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.deletedItem.productID).to.equal('789');
            (0, chai_1.expect)(res.body.data.deletedItem.quantity).to.equal(2);
        }));
    });
});
