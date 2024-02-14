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
const user_1 = __importDefault(require("../../models/user"));
(0, globals_1.describe)('User Controller', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
    }));
    (0, globals_1.describe)('POST /user', () => {
        (0, globals_1.it)('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/user')
                .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'testpassword',
                role: 'user',
                address: '123 Test St',
                phone: '1234567890'
            });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('newUser');
            (0, globals_1.expect)(res.body.newUser.username).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('GET /user', () => {
        (0, globals_1.it)('should get users', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/user');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('users');
        }));
        (0, globals_1.it)('should get user by username', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/user?username=testuser');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('users');
            (0, globals_1.expect)(res.body.users[0].username).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('GET /user/:id', () => {
        (0, globals_1.it)('should get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ username: 'testuser' });
            if (!user) {
                throw new Error('User not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .get(`/user/${user._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('user');
            (0, globals_1.expect)(res.body.user.username).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('PUT /user/:id', () => {
        (0, globals_1.it)('should create an order item', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ username: 'testuser' });
            if (!user) {
                throw new Error('User not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .put(`/user/${user._id}`)
                .send({
                productID: 'testproductid',
                quantity: 1,
                price: 100
            });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('order');
            (0, globals_1.expect)(res.body.order.userID).toHaveProperty(user._id);
        }));
    });
    (0, globals_1.describe)('GET /user/:id/orders', () => {
        (0, globals_1.it)('should get user orders', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ username: 'testuser' });
            if (!user) {
                throw new Error('User not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .get(`/user/${user._id}/orders`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('orders');
            (0, globals_1.expect)(res.body.order.userID).toHaveProperty(user._id);
        }));
    });
    (0, globals_1.describe)('DELETE /user/:id', () => {
        (0, globals_1.it)('should delete user by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ username: 'testuser' });
            if (!user) {
                throw new Error('User not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete(`/user/${user._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('user');
            (0, globals_1.expect)(res.body.user.username).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('DELETE /user/:username', () => {
        (0, globals_1.it)('should delete user by username', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete('/user/testuser');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('user');
            (0, globals_1.expect)(res.body.user.username).toHaveProperty('testuser');
        }));
    });
    (0, globals_1.describe)('DELETE /user', () => {
        (0, globals_1.it)('should delete all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete('/user');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('users');
        }));
    });
});
