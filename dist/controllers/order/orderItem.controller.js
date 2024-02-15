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
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const orderItemController = {
    createItem: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { orderID, productID, quantity, itemPrice } = req.body;
        // check if item already exists
        let checkItem = yield orderItem_1.default.findOne({ productID, isDeleted: false });
        if (checkItem) {
            throw new utils_1.AppError(400, "Item already exists", "Create Item Error");
        }
        let newItem = yield orderItem_1.default.create({ orderID, productID, quantity, itemPrice });
        (0, utils_1.sendResponse)(res, 200, true, { newItem }, null, "Item created");
    })),
    getAllItems: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let { id } = req.params;
        let allItems = yield orderItem_1.default.find({ orderID: id, isDeleted: false });
        (0, utils_1.sendResponse)(res, 200, true, { allItems }, null, null);
    })),
};
exports.default = orderItemController;
