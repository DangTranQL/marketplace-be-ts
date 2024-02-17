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
const user_controller_1 = __importDefault(require("./user.controller"));
const user_1 = __importDefault(require("../../models/user"));
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
jest.mock('../../models/user');
jest.mock('../../models/order');
jest.mock('../../models/orderItem');
jest.mock('bcryptjs');
describe('User Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: 'buyer',
                address: '123 Test St',
                phone: '1234567890',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    // createUser test
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        user_1.default.findOne.mockResolvedValue(null);
        bcryptjs_1.default.genSalt.mockResolvedValue('salt');
        bcryptjs_1.default.hash.mockResolvedValue('hashedpassword');
        const newUser = Object.assign(Object.assign({}, req.body), { password: 'hashedpassword', generateToken: jest.fn().mockResolvedValue('token') });
        user_1.default.create.mockResolvedValue(newUser);
        yield user_controller_1.default.createUser(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newUser, accessToken: 'token' },
            message: "User and cart created"
        });
    }));
    // getUsers test
    it('should get users', () => __awaiter(void 0, void 0, void 0, function* () {
        req.query = {
            page: '1',
            limit: '10',
            username: 'testuser',
        };
        const users = [
            { username: 'testuser', email: 'test@example.com' },
        ];
        user_1.default.countDocuments.mockResolvedValue(users.length);
        user_1.default.find.mockResolvedValue(users);
        yield user_controller_1.default.getUsers(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { users, totalPages: 1, count: users.length },
            message: null
        });
    }));
    // getUserById test
    it('should get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            id: '123',
        };
        const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
        user_1.default.findOne.mockResolvedValue(user);
        yield user_controller_1.default.getUserById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { user },
            message: null
        });
    }));
    // updateUserById test
    it('should update user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            id: '123',
        };
        req.body = {
            username: 'testuser2',
            email: 'testuser2@example.com',
            password: 'password123',
            role: 'buyer',
            address: '123 Test St',
            phone: '1234567890',
        };
        const user = { _id: '123', username: 'testuser2', email: 'testuser2@example.com', password: 'password123', role: 'buyer', address: '123 Test St', phone: '1234567890' };
        user_1.default.findOne.mockResolvedValue(user);
        user_1.default.prototype.save.mockResolvedValue(user);
        yield user_controller_1.default.updateUserById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { user },
            message: "User updated"
        });
    }));
    // createOrderItem test
    it('should create order item', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            id: '123',
        };
        req.body = {
            productID: '456',
            title: 'testproduct',
            quantity: 2,
            price: 100,
            image: 'testimage'
        };
        const order = { _id: '789', userID: '123', status: 'pending', price: 0 };
        const orderItem = { orderID: '789', productID: '456', quantity: 2, itemPrice: 100 };
        order_1.default.findOne.mockResolvedValue(order);
        orderItem_1.default.findOne.mockResolvedValue(null);
        orderItem_1.default.create.mockResolvedValue(orderItem);
        yield user_controller_1.default.createOrderItem(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order },
            message: "Product added to order"
        });
    }));
    // getOrder test
    it('should get order', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            id: '123',
        };
        const order = { _id: '789', userID: '123', status: 'pending', price: 0 };
        const orderItems = [
            { orderID: '789', productID: '456', quantity: 2, itemPrice: 100 },
        ];
        order_1.default.findOne.mockResolvedValue(order);
        orderItem_1.default.find.mockResolvedValue(orderItems);
        yield user_controller_1.default.getOrder(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: order, orderItems: orderItems },
            message: null
        });
    }));
    // deleteUserById test
    it('should delete user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            id: '123',
        };
        const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
        user_1.default.findOne.mockResolvedValue(user);
        orderItem_1.default.deleteMany.mockResolvedValue({ ok: 1 });
        order_1.default.deleteOne.mockResolvedValue({ ok: 1 });
        user_1.default.deleteOne.mockResolvedValue({ ok: 1 });
        yield user_controller_1.default.deleteUserById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: "User deleted"
        });
    }));
    // deleteUserByUsername test
    it('should delete user by username', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            username: 'testuser',
        };
        const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
        user_1.default.findOne.mockResolvedValue(user);
        orderItem_1.default.deleteMany.mockResolvedValue({ ok: 1 });
        order_1.default.deleteOne.mockResolvedValue({ ok: 1 });
        user_1.default.deleteOne.mockResolvedValue({ ok: 1 });
        yield user_controller_1.default.deleteUserByUsername(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: "User deleted"
        });
    }));
    // deleteAllUsers test
    it('should delete all users', () => __awaiter(void 0, void 0, void 0, function* () {
        user_1.default.deleteMany.mockResolvedValue({ ok: 1 });
        order_1.default.deleteMany.mockResolvedValue({ ok: 1 });
        orderItem_1.default.deleteMany.mockResolvedValue({ ok: 1 });
        yield user_controller_1.default.deleteAllUsers(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: "All users deleted"
        });
    }));
});
