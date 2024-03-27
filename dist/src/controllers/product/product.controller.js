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
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const utils_1 = require("../../helpers/utils");
const product_1 = __importDefault(require("../../models/product"));
exports.createProduct = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, category, stocks, price, image } = req.body;
    // check if product already exists
    // let checkProduct = await Product.findOne({ title: title });
    // if (checkProduct) {
    //   throw new AppError(400, "Product already exists", "Create Product Error");
    // }
    let newProduct = yield product_1.default.create({ title, description, category, stocks, price, image });
    (0, utils_1.sendResponse)(res, 200, true, { newProduct }, null, "Product created");
}));
exports.getProducts = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let _a = req.query, { page, limit } = _a, filter = __rest(_a, ["page", "limit"]);
    let filterCondition = [];
    if (filter.title) {
        filterCondition.push({
            title: { $regex: filter.title, $options: "i" },
        });
    }
    if (filter.category) {
        filterCondition.push({
            category: { $regex: filter.category, $options: "i" },
        });
    }
    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};
    const count = yield product_1.default.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = (page - 1) * limit;
    let products = null;
    if (filter.option == "priceDesc") {
        products = yield product_1.default.find(filterCriteria).sort({ price: -1 }).skip(offset).limit(limit);
    }
    else if (filter.option == "priceAsc") {
        products = yield product_1.default.find(filterCriteria).sort({ price: 1 }).skip(offset).limit(limit);
    }
    else if (filter.option == "featured") {
        products = yield product_1.default.find(filterCriteria).sort({ sold: -1 }).skip(offset).limit(limit);
    }
    else {
        products = yield product_1.default.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);
    }
    (0, utils_1.sendResponse)(res, 200, true, { products, totalPages, count }, null, null);
}));
exports.getProductById = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let product = yield product_1.default.findOne({ _id: id });
    if (!product) {
        throw new utils_1.AppError(404, "Product not found", "Get Product Error");
    }
    (0, utils_1.sendResponse)(res, 200, true, { product }, null, null);
}));
exports.updateProductById = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, category, stocks, price, image } = req.body;
    console.log("req.body", req.body);
    let product = yield product_1.default.findOne({ _id: id });
    if (!product) {
        throw new utils_1.AppError(404, "Product not found", "Update Product Error");
    }
    product.title = title;
    product.description = description;
    product.category = category;
    product.stocks = stocks;
    product.price = price;
    product.image = image;
    yield product.save();
    (0, utils_1.sendResponse)(res, 200, true, { product }, null, "Product updated");
}));
exports.deleteProductById = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let product = yield product_1.default.findOne({ _id: id });
    if (!product) {
        throw new utils_1.AppError(404, "Product not found", "Delete Product Error");
    }
    yield product_1.default.deleteOne({ _id: id });
    (0, utils_1.sendResponse)(res, 200, true, { product }, null, "Product deleted");
}));
