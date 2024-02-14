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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const globals_1 = require("@jest/globals");
const product_1 = __importDefault(require("../../models/product"));
(0, globals_1.describe)('Product Controller', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield product_1.default.deleteMany({});
    }));
    (0, globals_1.describe)('POST /product', () => {
        (0, globals_1.it)('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/product')
                .send({
                name: 'testproduct',
                description: 'testdescription',
                price: 100,
                stock: 100
            });
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('newProduct');
            (0, globals_1.expect)(res.body.newProduct.name).toHaveProperty('testproduct');
        }));
    });
    (0, globals_1.describe)('GET /product', () => {
        (0, globals_1.it)('should get products', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/product');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('products');
        }));
        (0, globals_1.it)('should get product by title', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/product?title=testproduct');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('products');
            (0, globals_1.expect)(res.body.products[0].name).toHaveProperty('testproduct');
        }));
        (0, globals_1.it)('should get product by category', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/product?category=testcategory');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('products');
        }));
    });
    (0, globals_1.describe)('GET /product/:id', () => {
        (0, globals_1.it)('should get product by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_1.default.findOne({ name: 'testproduct' });
            if (!product) {
                throw new Error('Product not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .get(`/product/${product._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('product');
            (0, globals_1.expect)(res.body.product.name).toHaveProperty('testproduct');
        }));
    });
    (0, globals_1.describe)('DELETE /product/:id', () => {
        (0, globals_1.it)('should delete product by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_1.default.findOne({ name: 'testproduct' });
            if (!product) {
                throw new Error('Product not found');
            }
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete(`/product/${product._id}`);
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('deletedProduct');
            (0, globals_1.expect)(res.body.deletedProduct.name).toHaveProperty('testproduct');
        }));
    });
    (0, globals_1.describe)('DELETE /product/:title', () => {
        (0, globals_1.it)('should delete product by title', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete('/product/testproduct');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('deletedProduct');
            (0, globals_1.expect)(res.body.deletedProduct.name).toHaveProperty('testproduct');
        }));
    });
    (0, globals_1.describe)('DELETE /product', () => {
        (0, globals_1.it)('should delete all products', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .delete('/product');
            (0, globals_1.expect)(res.status).toBe(200);
            (0, globals_1.expect)(res.body).toHaveProperty('products');
        }));
    });
});
