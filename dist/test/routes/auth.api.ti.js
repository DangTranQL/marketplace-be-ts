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
const auth_api_1 = __importDefault(require("../../routes/auth.api"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', auth_api_1.default);
describe('POST / - User Login', () => {
    it('should respond with a 200 status code for successful login', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/')
            .send({
            email: 'test@test.com',
            password: 'password123'
        });
        expect(response.statusCode).toBe(200);
    }));
    it('should respond with a 400 status code for validation errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/')
            .send({
            email: 'test',
            password: 'password123'
        });
        expect(response.statusCode).toBe(400);
    }));
});
