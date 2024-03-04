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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../../models/user"));
const generateToken_1 = require("../../helpers/generateToken");
const userController = {
    createUser: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let { username, email, password, role, address, phone } = req.body;
        // check if user already exists
        let user = yield user_1.default.findOne({ email: email });
        if (user) {
            throw new utils_1.AppError(400, "User already exists", "Create User Error");
        }
        // encrypt password
        const salt = yield bcryptjs_1.default.genSalt(10);
        password = yield bcryptjs_1.default.hash(password, salt);
        let newUser = yield user_1.default.create({ username, email, password, role, address, phone });
        // access Token
        const accessToken = yield (0, generateToken_1.generateToken)(newUser);
        (0, utils_1.sendResponse)(res, 200, true, { newUser, accessToken }, null, "User and cart created");
    })),
    getCurrentUser: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const user = yield user_1.default.findOne({ _id: userId });
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, null);
    })),
    getUserById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let user = yield user_1.default.findOne({ _id: id });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Get User Error");
        }
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, null);
    })),
    updateCurrentUser: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        const { username, address, phone } = req.body;
        let user = yield user_1.default.findOne({ _id: userId });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Update User Error");
        }
        user.username = username;
        user.address = address;
        user.phone = phone;
        yield user.save();
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, "User updated");
    })),
    updateUserById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { username, address, phone } = req.body;
        let user = yield user_1.default.findOne({ _id: id });
        if (!user) {
            throw new utils_1.AppError(404, "User not found", "Update User Error");
        }
        user.username = username;
        user.address = address;
        user.phone = phone;
        yield user.save();
        (0, utils_1.sendResponse)(res, 200, true, { user }, null, "User updated");
    })),
};
exports.default = userController;
