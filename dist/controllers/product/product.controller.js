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
const product_1 = __importDefault(require("../../models/product"));
const productController = {
    createProduct: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, category, stocks, price, image } = req.body;
        // check if product already exists
        let checkProduct = yield product_1.default.findOne({ title: title, isDeleted: false });
        if (checkProduct) {
            throw new utils_1.AppError(400, "Product already exists", "Create Product Error");
        }
        let newProduct = yield product_1.default.create({ title, description, category, stocks, price, image });
        (0, utils_1.sendResponse)(res, 200, true, { newProduct }, null, "Product created");
    })),
    getProducts: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let _a = req.query, { page: pageQuery, limit: limitQuery } = _a, filter = __rest(_a, ["page", "limit"]);
        const page = parseInt(pageQuery) || 1;
        const limit = parseInt(limitQuery) || 10;
        let filterCondition = [];
        if (filter.title) {
            filterCondition.push({
                isDeleted: false,
                title: { $regex: filter.title, $options: "i" },
            });
        }
        if (filter.category) {
            filterCondition.push({
                isDeleted: false,
                category: { $regex: filter.category, $options: "i" },
            });
        }
        const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};
        const count = yield product_1.default.countDocuments(filterCriteria);
        const totalPages = Math.ceil(count / limit);
        const offset = (page - 1) * limit;
        let products = yield product_1.default.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);
        (0, utils_1.sendResponse)(res, 200, true, { products, totalPages, count }, null, null);
    })),
    getProductById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let product = yield product_1.default.findOne({ _id: id, isDeleted: false });
        if (!product) {
            throw new utils_1.AppError(404, "Product not found", "Get Product Error");
        }
        (0, utils_1.sendResponse)(res, 200, true, { product }, null, null);
    })),
    deleteProductById: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        let product = yield product_1.default.findOne({ _id: id, isDeleted: false });
        if (!product) {
            throw new utils_1.AppError(404, "Product not found", "Delete Product Error");
        }
        else {
            product.isDeleted = true;
            yield product.save();
        }
        (0, utils_1.sendResponse)(res, 200, true, null, null, "Product deleted");
    })),
    deleteAllProducts: (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield product_1.default.deleteMany({});
        (0, utils_1.sendResponse)(res, 200, true, null, null, "All products deleted");
    })),
};
exports.default = productController;
