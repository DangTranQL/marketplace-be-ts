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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const globals_1 = require("@jest/globals");
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
(0, globals_1.describe)('Order Controller', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield order_1.default.deleteMany({});
    }));
    (0, globals_1.describe)('POST /order', () => {
        (0, globals_1.it)('should create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
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
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('newOrder');
            (0, globals_1.expect)(res.body.newOrder.user).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('GET /order/:id', () => {
        (0, globals_1.it)('should get order by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.default.findOne({ user: 'testuser' });
            if (!order) {
                throw new Error('Order not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .get(`/order/${order._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('order');
            (0, globals_1.expect)(res.body.order.user).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('GET /order/search/:userID', () => {
        (0, globals_1.it)('should get order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/order/testuser/search');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('orders');
        }));
    });
    (0, globals_1.describe)('PUT /order/:id', () => {
        (0, globals_1.it)('should update order', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.default.findOne({ user: 'testuser' });
            if (!order) {
                throw new Error('Order not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .put(`/order/${order._id}`)
                .send({
                status: "processing",
                paymentMethod: "cash"
            });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('order');
            (0, globals_1.expect)(res.body.order.total).toBe(200);
        }));
    });
    (0, globals_1.describe)('PUT /order/:id/item', () => {
        (0, globals_1.it)('should update order item', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.default.findOne({ user: 'testuser' });
            if (!order) {
                throw new Error('Order not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .put(`/order/${order._id}/item`)
                .send({
                product: 'testproduct',
                quantity: 2
            });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('order');
            (0, globals_1.expect)(res.body.order.total).toBe(300);
        }));
    });
    (0, globals_1.describe)('DELETE /order/:id', () => {
        (0, globals_1.it)('should delete order by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.default.findOne({ user: 'testuser' });
            if (!order) {
                throw new Error('Order not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete(`/order/${order._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('deletedOrder');
            (0, globals_1.expect)(res.body.deletedOrder.user).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('DELETE /order/:userID', () => {
        (0, globals_1.it)('should delete order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.default.findOne({ userID: 'testuser' });
            if (!order) {
                throw new Error('Order not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete('/order/testuser');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('deletedOrders');
        }));
    });
    (0, globals_1.describe)('DELETE /order/:id/item', () => {
        (0, globals_1.it)('should delete order item by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield order_1.default.findOne({ user: 'testuser' });
            if (!order) {
                throw new Error('Order not found');
            }
            const item = yield orderItem_1.default.findOne({ orderID: order._id, product: 'testproduct' });
            if (!item) {
                throw new Error('Item not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete(`/order/${order._id}/item/${item._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('deletedItem');
            (0, globals_1.expect)(res.body.deletedItem.product).toHaveProperty('testproduct');
        }));
    });
});
