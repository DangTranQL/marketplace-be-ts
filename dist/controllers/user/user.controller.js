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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../../models/user"));
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const userController = {
    createUser: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, email, password, role, address, phone } = req.body;
        // check if user already exists
        let user = yield user_1.default.findOne({ email: email, isDeleted: false });
        if (user) {
            throw new utils_1.AppError(400, "User already exists", "Create User Error");
        }
        // encrypt password
        const salt = yield bcryptjs_1.default.genSalt(10);
        password = yield bcryptjs_1.default.hash(password, salt);
        let newUser = yield user_1.default.create({ username, email, password, role, address, phone });
        const accessToken = yield newUser.generateToken();
        (0, utils_1.sendResponse)(res, 200, true, { newUser, accessToken }, null, "User and cart created");
    })),
    getUsers: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let _a = req.query, { page: pageQuery, limit: limitQuery } = _a, filter = __rest(_a, ["page", "limit"]);
        const page = parseInt(pageQuery) || 1;
        const limit = parseInt(limitQuery) || 10;
        const filterCondition = [];
        if (filter.username) {
            filterCondition.push({
                isDeleted: false,
                username: { $regex: filter.username, $options: "i" },
            });
        }
        const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};
        const count = yield user_1.default.countDocuments(filterCriteria);
        const totalPages = Math.ceil(count / limit);
        const offset = (page - 1) * limit;
        let users = yield user_1.default.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);
        (0, utils_1.sendResponse)(res, 200, true, { users, totalPages, count }, null, null);
    })),
    getCurrentUser: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.userId;
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, null);
    })),
    getUserById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let user = yield user_1.default.findOne({ _id: id, isDeleted: false });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Get User Error");
        }
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, null);
    })),
    updateUserById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { username, email, password, role, address, phone } = req.body;
        let user = yield user_1.default.findOne({ _id: id, isDeleted: false });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Update User Error");
        }
        user.username = username;
        user.email = email;
        user.password = password;
        user.role = role;
        user.address = address;
        user.phone = phone;
        yield user.save();
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, "User updated");
    })),
    createOrderItem: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { productID, title, quantity, price, image } = req.body;
        let order = yield order_1.default.findOne({ userID: id, status: "pending", isDeleted: false });
        if (!order) {
            order = yield order_1.default.create({ userID: id, status: "pending", price: 0 });
        }
        let orderPrice = order.price;
        let item = yield orderItem_1.default.findOne({ orderID: order._id, productID: productID });
        if (item) {
            item.quantity += quantity;
        }
        else {
            yield orderItem_1.default.create({ orderID: order._id, productID: productID, title: title, quantity: quantity, itemPrice: price, image: image });
            orderPrice += price * quantity;
        }
        order.price = orderPrice;
        yield order.save();
        (0, utils_1.sendResponse)(res, 200, true, { order }, null, "Product added to order");
    })),
    getOrder: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let order = yield order_1.default.findOne({ userID: id, status: "pending", isDeleted: false });
        if (!order) {
            throw new utils_1.AppError(404, "Order not found", "Get Order Error");
        }
        let orderItems = yield orderItem_1.default.find({ orderID: order._id });
        let response = {
            order: order,
            orderItems: orderItems,
        };
        (0, utils_1.sendResponse)(res, 200, true, response, null, null);
    })),
    deleteUserById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let user = yield user_1.default.findOne({ _id: id, isDeleted: false });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Delete User Error");
        }
        else {
            yield orderItem_1.default.deleteMany({ orderID: id });
            yield order_1.default.deleteOne({ userID: id });
            yield user_1.default.deleteOne({ _id: id });
        }
        (0, utils_1.sendResponse)(res, 200, true, null, null, "User deleted");
    })),
    deleteUserByUsername: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.params;
        let user = yield user_1.default.findOne({ username: username, isDeleted: false });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Delete User Error");
        }
        else {
            yield orderItem_1.default.deleteMany({ orderID: user._id });
            yield order_1.default.deleteOne({ userID: user._id });
            yield user_1.default.deleteOne({ username: username });
        }
        (0, utils_1.sendResponse)(res, 200, true, null, null, "User deleted");
    })),
    deleteAllUsers: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
        yield order_1.default.deleteMany({});
        yield orderItem_1.default.deleteMany({});
        (0, utils_1.sendResponse)(res, 200, true, null, null, "All users deleted");
    })),
};
exports.default = userController;
