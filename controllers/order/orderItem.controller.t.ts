import { Request, Response, NextFunction } from 'express';
import orderItemController from './orderItem.controller';
import OrderItem from '../../models/orderItem';

jest.mock('../../models/orderItem');

describe('Order Item Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {
                orderID: '123',
                productID: '456',
                quantity: 2,
                itemPrice: 100,
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

    // createItem test
    it('should create a new order item', async () => {
        (OrderItem.findOne as jest.Mock).mockResolvedValue(null);
        const newItem = {
            ...req.body,
        };
        (OrderItem.create as jest.Mock).mockResolvedValue(newItem);

        await orderItemController.createItem(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newItem },
            message: 'Item created',
        });
    });

    // getAllItems test
    it('should get all order items', async () => {
        (OrderItem.find as jest.Mock).mockResolvedValue([
            {
                orderID: '123',
            },
        ]);

        await orderItemController.getAllItems(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { allItems: [{ orderID: '123' }] },
            message: null,
        });
    });
});