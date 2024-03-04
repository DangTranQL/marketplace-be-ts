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
        const { userID, status } = req.body;
        // check if order already exists
        let checkOrder = yield order_1.default.findOne({ userID, status: "pending" });
        if (checkOrder) {
            (0, utils_1.sendResponse)(res, 200, true, { order: checkOrder }, null, "Order already exists");
        }
        let newOrder = yield order_1.default.create({ userID, status, price: 0 });
        (0, utils_1.sendResponse)(res, 200, true, { newOrder }, null, "Order created");
    })),
    createItem: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { productID, title, quantity, itemPrice, image } = req.body;
        const userId = req.userId;
        let order = yield order_1.default.findOne({ _id: id, userID: userId, status: "pending" });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Create Item Error");
        }
        const item = yield orderItem_1.default.create({ orderID: id, productID, title, quantity, itemPrice, image });
        order.price += item.itemPrice * item.quantity;
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item created");
    })),
    getOrderById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let order = yield order_1.default.findOne({ _id: id });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Get Order Error");
        }
        let orderItems = yield orderItem_1.default.find({ orderID: order._id });
        (0, utils_1.sendResponse)(res, 200, true, { orderItems }, null, "Get Order by Id successful");
    })),
    getOrdersByUserId: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.userId;
        let order = yield order_1.default.findOne({ userID: userID });
        if (!order) {
            (0, utils_1.sendResponse)(res, 200, true, { order: null, orderItems: null }, null, "No orders");
            return;
        }
        let orderItems = yield orderItem_1.default.find({ orderID: order._id });
        (0, utils_1.sendResponse)(res, 200, true, { order, orderItems }, null, "Get Order by User Id successful");
    })),
    addToCart: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const { productID, title, quantity, itemPrice, image } = req.body;
        let order = yield order_1.default.findOne({ userID: userId, status: "pending" });
        if (!order) {
            order = yield order_1.default.create({ userID: userId, status: "pending", price: 0 });
            let item = yield orderItem_1.default.create({ orderID: order._id, productID, title, quantity, itemPrice, image });
            order.price = item.itemPrice * item.quantity;
            yield order.save();
            (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item added to cart");
        }
        else {
            let item = yield orderItem_1.default.create({ orderID: order._id, productID, title, quantity, itemPrice, image });
            order.price += item.itemPrice * item.quantity;
            yield order.save();
            (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item added to cart");
        }
    })),
    getOrderItemById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, itemid } = req.params;
        let order = yield order_1.default.findOne({ _id: id });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Get Order Error");
        }
        let item = yield orderItem_1.default.findOne({ _id: itemid });
        if (!item) {
            throw new utils_1.AppError(404, "Item not found", "Get Item Error");
        }
        (0, utils_1.sendResponse)(res, 200, true, { item }, null, "Get Item by Id successful");
    })),
    updateOrder: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { status, paymentMethod } = req.body;
        let order = yield order_1.default.findOneAndUpdate({ _id: id }, { status, paymentMethod });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Update Order Error");
        }
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Order updated");
    })),
    updateItem: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, itemid } = req.params;
        const { newQuantity } = req.body;
        let order = yield order_1.default.findOne({ _id: id, status: "pending" });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Update Item Error");
        }
        let item = yield orderItem_1.default.findOne({ orderID: id, _id: itemid });
        if (!item) {
            throw new utils_1.AppError(404, "Item not found", "Update Item Error");
        }
        order.price -= item.itemPrice * item.quantity;
        yield order.save();
        item.quantity = newQuantity;
        yield item.save();
        order.price += item.itemPrice * item.quantity;
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item updated");
    })),
    deleteOrderById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let order = yield order_1.default.findOne({ _id: id });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Delete Order Error");
        }
        yield orderItem_1.default.deleteMany({ orderID: id });
        yield order_1.default.deleteOne({ _id: id });
        (0, utils_1.sendResponse)(res, 200, true, null, null, "Order deleted");
    })),
    deleteItemById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, itemid } = req.params;
        let order = yield order_1.default.findOne({ _id: id, status: "pending" });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Delete Item Error");
        }
        let item = yield orderItem_1.default.findOne({ orderID: id, _id: itemid });
        if (!item) {
            throw new utils_1.AppError(404, "Item not found", "Delete Item Error");
        }
        order.price -= item.itemPrice * item.quantity;
        yield orderItem_1.default.deleteOne({ _id: item._id });
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Item deleted");
    })),
};
exports.default = orderController;
