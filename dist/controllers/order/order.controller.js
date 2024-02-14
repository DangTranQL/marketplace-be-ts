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
const utils_1 = require("../../helpers/utils");
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const orderController = {
    createOrder: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userID, status, paymentMethod } = req.body;
        // check if order already exists
        let checkOrder = yield order_1.default.findOne({ userID, isDeleted: false });
        if (checkOrder && checkOrder.status === "pending") {
            throw new utils_1.AppError(400, "Order already exists", "Create Order Error");
        }
        let newOrder = yield order_1.default.create({ userID, status, paymentMethod });
        (0, utils_1.sendResponse)(res, 200, true, { newOrder }, null, "Order created");
    })),
    getOrderById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let order = yield order_1.default.findOne({ _id: id, isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Get Order Error");
        }
        let orderItems = yield orderItem_1.default.find({ orderID: order._id });
        (0, utils_1.sendResponse)(res, 200, true, { orderItems }, null, "Get Order by Id successful");
    })),
    getOrderByUserId: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userID } = req.params;
        let order = yield order_1.default.findOne({ userID: userID, isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Get Order Error");
        }
        let orderItems = yield orderItem_1.default.find({ orderID: order._id });
        (0, utils_1.sendResponse)(res, 200, true, { orderItems }, null, "Get Order by User Id successful");
    })),
    updateOrder: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { status, paymentMethod } = req.body;
        let order = yield order_1.default.findOneAndUpdate({ _id: id, isDeleted: false }, { status, paymentMethod });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Update Order Error");
        }
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Order updated");
    })),
    updateItem: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { productID, quantity } = req.body;
        let order = yield order_1.default.findOne({ _id: id, isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Update Item Error");
        }
        let item = yield orderItem_1.default.findOne({ orderID: id, productID: productID, isDeleted: false });
        if (!item) {
            throw new utils_1.AppError(404, "Item not found", "Update Item Error");
        }
        order.price -= item.itemPrice * item.quantity;
        item.quantity = quantity;
        yield item.save();
        order.price += item.itemPrice * item.quantity;
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item updated");
    })),
    deleteOrderById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let order = yield order_1.default.findOne({ _id: id, isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Delete Order Error");
        }
        else {
            let orderItems = yield orderItem_1.default.find({ orderID: order._id });
            for (let i = 0; i < orderItems.length; i++) {
                orderItems[i].isDeleted = true;
                yield orderItems[i].save();
            }
        }
        order.isDeleted = true;
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, null, null, "Order deleted");
    })),
    deleteOrderByUserId: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userID } = req.params;
        let order = yield order_1.default.findOne({ userID: userID, isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Delete Order Error");
        }
        else {
            let orderItems = yield orderItem_1.default.find({ orderID: order._id });
            for (let i = 0; i < orderItems.length; i++) {
                orderItems[i].isDeleted = true;
                yield orderItems[i].save();
            }
        }
        order.isDeleted = true;
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, null, null, "Order deleted");
    })),
    deleteItemById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { productID } = req.body;
        let order = yield order_1.default.findOne({ _id: id, isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Delete Item Error");
        }
        let item = yield orderItem_1.default.findOne({ orderID: id, productID: productID, isDeleted: false });
        if (!item) {
            throw new utils_1.AppError(404, "Item not found", "Delete Item Error");
        }
        order.price -= item.itemPrice * item.quantity;
        yield orderItem_1.default.deleteOne({ _id: item._id });
        yield order.save();
        let items = yield orderItem_1.default.find({ orderID: id, isDeleted: false });
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item deleted");
    })),
};
exports.default = orderController;
