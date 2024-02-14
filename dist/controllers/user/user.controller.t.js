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
const express_1 = __importDefault(require("express"));
const globals_1 = require("@jest/globals");
const user_controller_1 = __importDefault(require("./user.controller"));
globals_1.jest.mock('../models/user');
(0, globals_1.describe)('Create User Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.post('/users', user_controller_1.default.createUser);
    });
    (0, globals_1.it)('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'testpassword',
            role: 'buyer',
            address: 'test address',
            phone: 1234567890
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/users')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('username', mockUser.username);
        (0, globals_1.expect)(res.body).toHaveProperty('email', mockUser.email);
        (0, globals_1.expect)(res.body).toHaveProperty('role', mockUser.role);
        (0, globals_1.expect)(res.body).toHaveProperty('address', mockUser.address);
        (0, globals_1.expect)(res.body).toHaveProperty('phone', mockUser.phone);
    }));
    (0, globals_1.it)('should return 400 because of invalid format', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            username: 123,
            email: 'testuser@test.com',
            password: 'testpassword',
            role: 'buyer',
            address: 'test address',
            phone: 1234567890
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/users')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should return 400 because of missing fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            username: 'testuser2',
            email: 'testuser2@test.com',
            password: 'testpassword'
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/users')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(400);
    }));
    (0, globals_1.it)('should return 400 because user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'testpassword',
            role: 'buyer',
            address: 'test address',
            phone: 1234567890
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/users')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(400);
    }));
});
(0, globals_1.describe)('Get Users Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.get('/users', user_controller_1.default.getUsers);
    });
    (0, globals_1.it)('should get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('users');
    }));
    (0, globals_1.it)('should get user with username', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users?username=testuser');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('users');
    }));
    (0, globals_1.it)('should return 400 because of invalid query', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users?limit=invalid');
        (0, globals_1.expect)(res.status).toBe(400);
    }));
});
(0, globals_1.describe)('Get User By Id Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.get('/users/:id', user_controller_1.default.getUserById);
    });
    (0, globals_1.it)('should get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users/123');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('user');
    }));
    (0, globals_1.it)('should return 404 because user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users/123');
        (0, globals_1.expect)(res.status).toBe(404);
    }));
});
(0, globals_1.describe)('Create Order Item Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.put('/users/:id', user_controller_1.default.createOrderItem);
    });
    (0, globals_1.it)('should create order item', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put('/users/123')
            .send({
            productID: '123',
            quantity: 2,
            price: 100
        });
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('order');
    }));
});
(0, globals_1.describe)('Get Order Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.get('/users/:id/orders', user_controller_1.default.getOrder);
    });
    (0, globals_1.it)('should get order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users/123/orders');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('order');
        (0, globals_1.expect)(res.body).toHaveProperty('orderItems');
    }));
    (0, globals_1.it)('should return 404 because order not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/users/123/orders');
        (0, globals_1.expect)(res.status).toBe(404);
    }));
});
(0, globals_1.describe)('Delete User By Id Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.delete('/users/:id', user_controller_1.default.deleteUserById);
    });
    (0, globals_1.it)('should delete user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete('/users/123');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('user');
    }));
    (0, globals_1.it)('should return 404 because user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete('/users/123');
        (0, globals_1.expect)(res.status).toBe(404);
    }));
});
(0, globals_1.describe)('Delete User By Username Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.delete('/users/:username', user_controller_1.default.deleteUserByUsername);
    });
    (0, globals_1.it)('should delete user by username', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete('/users/testuser');
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('user');
    }));
    (0, globals_1.it)('should return 404 because user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete('/users/testuser456');
        (0, globals_1.expect)(res.status).toBe(404);
    }));
});
(0, globals_1.describe)('Delete All Users Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.delete('/users', user_controller_1.default.deleteAllUsers);
    });
    (0, globals_1.it)('should delete all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .delete('/users');
        (0, globals_1.expect)(res.status).toBe(200);
    }));
});
