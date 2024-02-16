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
const user_api_1 = __importDefault(require("../../routes/user.api"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', user_api_1.default);
describe('POST / - User Registration', () => {
    it('should respond with a 200 status code for successful registration', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/')
            .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St',
            phone: 1234567890
        });
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/')
            .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St'
        });
        expect(response.statusCode).toBe(400);
    }));
    it('should respond with a 200 status code for successfully getting all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/');
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 200 status code for successfully getting a user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/123');
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/abc');
        expect(response.statusCode).toBe(400);
    }));
    it('should respond with a 200 status code for successully getting orders by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/123/orders');
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/abc/orders');
        expect(response.statusCode).toBe(400);
    }));
    it('should respond with a 200 status code for successfully updating a user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put('/123')
            .send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St',
            phone: 1234567890
        });
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put('/abc')
            .send({
            username: 'testuser',
        });
    }));
    it('should respond with a 200 status code for successfully creating an order item', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put('/123/orders')
            .send({
            productID: '456',
            quantity: 1,
            price: 100
        });
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put('/abc/orders')
            .send({
            productID: '123',
            quantity: 1,
        });
        expect(response.statusCode).toBe(400);
    }));
    it('should respond with a 200 status code for successfully getting an order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/123/orders');
        expect(response.statusCode).toBe(200);
    }));
});
