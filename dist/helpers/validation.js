"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateOrderItem = exports.validateCreateOrder = exports.validateCreateProduct = exports.validateLogin = exports.validateCreateUser = exports.validateUserID = exports.validateId = void 0;
const utils_1 = require("../helpers/utils");
const joi_1 = __importDefault(require("joi"));
const idCheck = joi_1.default.object({
    id: joi_1.default.string().required(),
});
const userIDCheck = joi_1.default.object({
    userID: joi_1.default.string().required(),
});
const userCreateCheck = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.number().required(),
});
const loginCheck = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const productCreateCheck = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    stocks: joi_1.default.number().required(),
    price: joi_1.default.number().required(),
    image: joi_1.default.string().optional(),
});
const orderCreateCheck = joi_1.default.object({
    userID: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
});
const orderItemCreateCheck = joi_1.default.object({
    orderID: joi_1.default.string().required(),
    productID: joi_1.default.string().required(),
    quantity: joi_1.default.number().required(),
    itemPrice: joi_1.default.number().required(),
    isDeleted: joi_1.default.boolean().optional(),
});
exports.validateId = (0, utils_1.validateSchema)(idCheck, "params");
exports.validateUserID = (0, utils_1.validateSchema)(userIDCheck, "params");
exports.validateCreateUser = (0, utils_1.validateSchema)(userCreateCheck, "body");
exports.validateLogin = (0, utils_1.validateSchema)(loginCheck, "body");
exports.validateCreateProduct = (0, utils_1.validateSchema)(productCreateCheck, "body");
exports.validateCreateOrder = (0, utils_1.validateSchema)(orderCreateCheck, "body");
exports.validateCreateOrderItem = (0, utils_1.validateSchema)(orderItemCreateCheck, "body");
