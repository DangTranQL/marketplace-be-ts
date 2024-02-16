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
const order_api_1 = __importDefault(require("../../routes/order.api"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', order_api_1.default);
describe('Order API', () => {
    it('should respond with a 200 status code for succesfully create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/')
            .send({
            userID: '123',
            status: 'pending',
            paymentMethod: 'card'
        });
        expect(res.status).toEqual(200);
        expect(res.body.data).toHaveProperty('orderID');
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/')
            .send({
            userID: '123',
            status: 'pending'
        });
        expect(res.status).toEqual(400);
    }));
    it('should respond with a 200 status code for successfully getting an order by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/789');
        expect(res.status).toEqual(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/abc');
        expect(res.status).toEqual(400);
    }));
    it('should respond with a 200 status code for successfully getting an order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/search/123');
        expect(res.status).toEqual(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/search/abc');
        expect(res.status).toEqual(400);
    }));
    it('should respond with a 200 status code for successfully updating an order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put('/789')
            .send({
            status: 'completed'
        });
        expect(res.status).toEqual(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put('/789')
            .send({
            status: 'arriving'
        });
        expect(res.status).toEqual(400);
    }));
    it('should respond with a 200 status code for successfully updating an item', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put('/item/789')
            .send({
            itemID: '456',
            quantity: 2,
            price: 20
        });
        expect(res.status).toEqual(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put('/item/789')
            .send({
            itemID: 'abc',
            quantity: 2,
            price: 20
        });
        expect(res.status).toEqual(400);
    }));
});
