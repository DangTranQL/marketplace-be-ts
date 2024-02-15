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
const orderItem_controller_1 = __importDefault(require("./orderItem.controller"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
jest.mock('../../models/orderItem');
describe('Order Item Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                orderID: '123',
                productID: '456',
                quantity: 2,
                itemPrice: 100,
            },
            params: {
                id: '123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    // createItem test
    it('should create a new order item', () => __awaiter(void 0, void 0, void 0, function* () {
        orderItem_1.default.findOne.mockResolvedValue(null);
        const newItem = Object.assign({}, req.body);
        orderItem_1.default.create.mockResolvedValue(newItem);
        yield orderItem_controller_1.default.createItem(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newItem },
            message: 'Item created',
        });
    }));
    // getAllItems test
    it('should get all order items', () => __awaiter(void 0, void 0, void 0, function* () {
        orderItem_1.default.find.mockResolvedValue([
            {
                orderID: '123',
            },
        ]);
        yield orderItem_controller_1.default.getAllItems(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { allItems: [{ orderID: '123' }] },
            message: null,
        });
    }));
});
