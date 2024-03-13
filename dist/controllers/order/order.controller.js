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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../helpers/utils");
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const product_1 = __importDefault(require("../../models/product"));
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
    getOrdersOfCurrentUser: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.userId;
        let _a = Object.assign({}, req.query), { page = '1', limit = '10' } = _a, filter = __rest(_a, ["page", "limit"]);
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const filterConditions = [{ userID: userID }];
        if (filter.status) {
            filterConditions.push({
                status: { $regex: filter.status, $options: "i" },
            });
        }
        const filterCriteria = filterConditions.length > 0 ? { $and: filterConditions } : {};
        const count = yield order_1.default.countDocuments(filterCriteria);
        const totalPage = Math.ceil(count / limit);
        const offset = (page - 1) * limit;
        let order = yield order_1.default.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);
        (0, utils_1.sendResponse)(res, 200, true, { order, totalPage, count }, null, null);
    })),
    getAllOrders: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userID = req.userId;
        console.log(userID);
        const pendingOrder = yield order_1.default.find({ status: "pending", userID });
        const pastOrders = yield order_1.default.find({ status: "completed", userID });
        (0, utils_1.sendResponse)(res, 200, true, { pendingOrder, pastOrders }, null, null);
    })),
    getOrderById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let order = yield order_1.default.findOne({ _id: id });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Get Order Error");
        }
        let orderItems = yield orderItem_1.default.find({ orderID: id });
        (0, utils_1.sendResponse)(res, 200, true, { order, orderItems }, null, "Get Order by Id successful");
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
        if (status === "completed") {
            let orderItems = yield orderItem_1.default.find({ orderID: id });
            for (let i = 0; i < orderItems.length; i++) {
                let product = yield product_1.default.findOne({ _id: orderItems[i].productID });
                if (!product) {
                    throw new utils_1.AppError(404, "Product not found", "Update Order Error");
                }
                product.stocks -= orderItems[i].quantity;
                product.sold += orderItems[i].quantity;
                yield (product === null || product === void 0 ? void 0 : product.save());
            }
        }
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Order updated");
    })),
    updateItem: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, itemid } = req.params;
        const { change } = req.body;
        let order = yield order_1.default.findOne({ _id: id, status: "pending" });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Update Item Error");
        }
        let item = yield orderItem_1.default.findOne({ orderID: id, _id: itemid });
        if (!item) {
            throw new utils_1.AppError(404, "Item not found", "Update Item Error");
        }
        order.price += item.itemPrice;
        yield order.save();
        item.quantity += change;
        yield item.save();
        (0, utils_1.sendResponse)(res, 200, true, { order, item }, null, "Item updated");
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
