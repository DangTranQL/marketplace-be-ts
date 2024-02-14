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
const auth_controller_1 = __importDefault(require("./auth.controller"));
(0, globals_1.describe)('Login Test', () => {
    let app;
    (0, globals_1.beforeAll)(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.post('/login', auth_controller_1.default.loginWithEmail);
    });
    (0, globals_1.it)('should login successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            email: 'usertest@test.com',
            password: 'testpassword'
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/login')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(200);
        (0, globals_1.expect)(res.body).toHaveProperty('token');
    }));
    (0, globals_1.it)('should return 401 because of wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            email: 'testuser@test.com',
            password: 'password'
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/login')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
    (0, globals_1.it)('should return 401 because of invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            email: 'test@test.com',
            password: 'password'
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/login')
            .send(mockUser);
        (0, globals_1.expect)(res.status).toBe(401);
    }));
});
