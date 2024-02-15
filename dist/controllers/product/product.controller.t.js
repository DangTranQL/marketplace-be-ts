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
const product_controller_1 = __importDefault(require("./product.controller"));
const product_1 = __importDefault(require("../../models/product"));
jest.mock('../../models/product');
describe('Product Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                title: 'Test Product',
                description: 'Test Description',
                category: 'Test Category',
                stocks: 10,
                price: 100,
                image: 'test.jpg',
            },
            query: {
                page: '1',
                limit: '10',
            },
            params: {
                id: '123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    // createProduct test
    it('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
        product_1.default.findOne.mockResolvedValue(null);
        const newProduct = Object.assign({}, req.body);
        product_1.default.create.mockResolvedValue(newProduct);
        yield product_controller_1.default.createProduct(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newProduct },
            message: 'Product created',
        });
    }));
    // getProducts test
    it('should get all products', () => __awaiter(void 0, void 0, void 0, function* () {
        product_1.default.find.mockResolvedValue([
            {
                title: 'Test Product',
            },
        ]);
        yield product_controller_1.default.getProducts(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { products: [{ title: 'Test Product' }] },
            message: 'Products found',
        });
    }));
    // getProductById test
    it('should get a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
        product_1.default.findById.mockResolvedValue({
            title: 'Test Product',
        });
        yield product_controller_1.default.getProductById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { product: { title: 'Test Product' } },
            message: 'Product found',
        });
    }));
    // updateProductById test
    it('should update a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
        product_1.default.findOne.mockResolvedValue({
            title: 'Test Product',
            save: jest.fn(),
        });
        yield product_controller_1.default.updateProductById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { product: { title: 'Test Product' } },
            message: 'Product updated',
        });
    }));
    // deleteProductById test
    it('should delete a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
        product_1.default.findById.mockResolvedValue({
            remove: jest.fn(),
        });
        yield product_controller_1.default.deleteProductById(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: 'Product deleted',
        });
    }));
    // deleteAllProducts test 
    it('should delete all products', () => __awaiter(void 0, void 0, void 0, function* () {
        product_1.default.deleteMany.mockResolvedValue({});
        yield product_controller_1.default.deleteAllProducts(req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: 'All products deleted',
        });
    }));
});
