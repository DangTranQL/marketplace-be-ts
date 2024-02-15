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
const order_controller_1 = __importDefault(require("./order.controller"));
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
jest.mock('../../models/order');
jest.mock('../../models/orderItem');
describe('Order Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                userID: 'testuser',
                status: 'pending',
                paymentMethod: 'card',
            },
            params: {
                id: '123',
                userID: 'testuser',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    // createOrder test
    it('should create a new order', () => __awaiter(void 0, void 0, void 0, function* () {
        order_1.default.findOne.mockResolvedValue(null);
        const newOrder = Object.assign({}, req.body);
        order_1.default.create.mockResolvedValue(newOrder);
        yield order_controller_1.default.createOrder(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newOrder },
            message: 'Order created',
        });
    }));
    // getOrderById test
    it('should get order by id', () => __awaiter(void 0, void 0, void 0, function* () {
        order_1.default.findOne.mockResolvedValue({
            _id: '123',
        });
        orderItem_1.default.find.mockResolvedValue([
            {
                orderID: '123',
            },
        ]);
        yield order_controller_1.default.getOrderById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { orderItems: [{ orderID: '123' }] },
            message: 'Get Order by Id successful',
        });
    }));
    // getOrderByUserId test
    it('should get order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        order_1.default.findOne.mockResolvedValue({
            _id: '123',
        });
        orderItem_1.default.find.mockResolvedValue([
            {
                orderID: '123',
            },
        ]);
        yield order_controller_1.default.getOrderByUserId(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { orderItems: [{ orderID: '123' }] },
            message: 'Get Order by User Id successful',
        });
    }));
    // updateOrder test
    it('should update order', () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = {
            status: 'completed',
            paymentMethod: 'cash',
        };
        order_1.default.findOneAndUpdate.mockResolvedValue({
            _id: '123',
        });
        yield order_controller_1.default.updateOrder(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order updated',
        });
    }));
    // updateItem test
    it('should update item', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {
            id: '123',
        };
        req.body = {
            productID: '456',
            quantity: 2,
        };
        const order = { _id: '123', price: 0 };
        const item = { itemPrice: 100, quantity: 2 };
        order_1.default.findOne.mockResolvedValue(order);
        orderItem_1.default.findOne.mockResolvedValue(item);
        yield order_controller_1.default.updateItem(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123', price: 200 } },
            message: 'Item updated',
        });
    }));
    // deleteOrderById test
    it('should delete order by id', () => __awaiter(void 0, void 0, void 0, function* () {
        order_1.default.findOne.mockResolvedValue({
            _id: '123',
        });
        orderItem_1.default.find.mockResolvedValue([
            {
                orderID: '123',
            },
        ]);
        yield order_controller_1.default.deleteOrderById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order deleted',
        });
    }));
    // deleteOrderByUserId test
    it('should delete order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        order_1.default.findOne.mockResolvedValue({
            _id: '123',
        });
        orderItem_1.default.find.mockResolvedValue([
            {
                orderID: '123',
            },
        ]);
        yield order_controller_1.default.deleteOrderByUserId(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order deleted',
        });
    }));
    // deleteOrderByUserId test
    it('should delete order by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        order_1.default.findOne.mockResolvedValue({
            _id: '123',
        });
        orderItem_1.default.find.mockResolvedValue([
            {
                orderID: '123',
            },
        ]);
        yield order_controller_1.default.deleteOrderByUserId(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order deleted',
        });
    }));
});
