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
const auth_controller_1 = __importDefault(require("./auth.controller"));
const user_1 = __importDefault(require("../../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
jest.mock('../../models/user');
jest.mock('bcryptjs');
describe('Auth Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it('should login with email', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            email: 'test@example.com',
            password: 'hashedpassword',
            generateToken: jest.fn().mockResolvedValue('token'),
        };
        user_1.default.findOne.mockResolvedValue(user);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        yield auth_controller_1.default.loginWithEmail(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { user, accessToken: 'token' },
            message: "Login successful"
        });
    }));
});
