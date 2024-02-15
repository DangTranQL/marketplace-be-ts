import { Request, Response, NextFunction } from 'express';
import productController from './product.controller';
import Product from '../../models/product';

jest.mock('../../models/product');

describe('Product Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

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
    it('should create a new product', async () => {
        (Product.findOne as jest.Mock).mockResolvedValue(null);
        const newProduct = {
            ...req.body,
        };
        (Product.create as jest.Mock).mockResolvedValue(newProduct);

        await productController.createProduct(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newProduct },
            message: 'Product created',
        });
    });

    // getProducts test
    it('should get all products', async () => {
        (Product.find as jest.Mock).mockResolvedValue([
            {
                title: 'Test Product',
            },
        ]);

        await productController.getProducts(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { products: [{ title: 'Test Product' }] },
            message: 'Products found',
        });
    });

    // getProductById test
    it('should get a product by id', async () => {
        (Product.findById as jest.Mock).mockResolvedValue({
            title: 'Test Product',
        });

        await productController.getProductById(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { product: { title: 'Test Product' } },
            message: 'Product found',
        });
    });

    // updateProductById test
    it('should update a product by id', async () => {
        (Product.findOne as jest.Mock).mockResolvedValue({
            title: 'Test Product',
            save: jest.fn(),
        });

        await productController.updateProductById(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { product: { title: 'Test Product' } },
            message: 'Product updated',
        });
    });

    // deleteProductById test
    it('should delete a product by id', async () => {
        (Product.findById as jest.Mock).mockResolvedValue({
            remove: jest.fn(),
        });

        await productController.deleteProductById(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: 'Product deleted',
        });
    });

    // deleteAllProducts test 
    it('should delete all products', async () => {
        (Product.deleteMany as jest.Mock).mockResolvedValue({});

        await productController.deleteAllProducts(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: null,
            message: 'All products deleted',
        });
    });
});