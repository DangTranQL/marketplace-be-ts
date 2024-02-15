import { Request, Response, NextFunction } from 'express';
import orderController from './order.controller';
import Order from '../../models/order';
import OrderItem from '../../models/orderItem';

jest.mock('../../models/order');
jest.mock('../../models/orderItem');

describe('Order Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: {
                userID: 'testuser',
                status: 'pending',
                paymentMethod: 'card',
            },
            params: {
                id: '123',
                userID: 'testuser',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    // createOrder test
    it('should create a new order', async () => {
        (Order.findOne as jest.Mock).mockResolvedValue(null);
        const newOrder = {
            ...req.body,
        };
        (Order.create as jest.Mock).mockResolvedValue(newOrder);

        await orderController.createOrder(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { newOrder },
            message: 'Order created',
        });
    });

    // getOrderById test
    it('should get order by id', async () => {
        (Order.findOne as jest.Mock).mockResolvedValue({
            _id: '123',
        });
        (OrderItem.find as jest.Mock).mockResolvedValue([
            {
                orderID: '123',
            },
        ]);

        await orderController.getOrderById(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { orderItems: [{ orderID: '123' }] },
            message: 'Get Order by Id successful',
        });
    });

    // getOrderByUserId test
    it('should get order by user id', async () => {
        (Order.findOne as jest.Mock).mockResolvedValue({
            _id: '123',
        });
        (OrderItem.find as jest.Mock).mockResolvedValue([
            {
                orderID: '123',
            },
        ]);

        await orderController.getOrderByUserId(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { orderItems: [{ orderID: '123' }] },
            message: 'Get Order by User Id successful',
        });
    });

    // updateOrder test
    it('should update order', async () => {
        req.body = {
            status: 'completed',
            paymentMethod: 'cash',
        };
        (Order.findOneAndUpdate as jest.Mock).mockResolvedValue({
            _id: '123',
        });

        await orderController.updateOrder(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order updated',
        });
    });

    // updateItem test
    it('should update item', async () => {
        req.params = {
            id: '123',
        };
        req.body = {
            productID: '456',
            quantity: 2,
        };
        const order = { _id: '123', price: 0 };
        const item = { itemPrice: 100, quantity: 2 };
        (Order.findOne as jest.Mock).mockResolvedValue(order);
        (OrderItem.findOne as jest.Mock).mockResolvedValue(item);

        await orderController.updateItem(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123', price: 200 } },
            message: 'Item updated',
        });
    });

    // deleteOrderById test
    it('should delete order by id', async () => {
        (Order.findOne as jest.Mock).mockResolvedValue({
            _id: '123',
        });
        (OrderItem.find as jest.Mock).mockResolvedValue([
            {
                orderID: '123',
            },
        ]);

        await orderController.deleteOrderById(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order deleted',
        });
    });

    // deleteOrderByUserId test
    it('should delete order by user id', async () => {
        (Order.findOne as jest.Mock).mockResolvedValue({
            _id: '123',
        });
        (OrderItem.find as jest.Mock).mockResolvedValue([
            {
                orderID: '123',
            },
        ]);

        await orderController.deleteOrderByUserId(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order deleted',
        });
    });

    // deleteOrderByUserId test
    it('should delete order by user id', async () => {
        (Order.findOne as jest.Mock).mockResolvedValue({
            _id: '123',
        });
        (OrderItem.find as jest.Mock).mockResolvedValue([
            {
                orderID: '123',
            },
        ]);

        await orderController.deleteOrderByUserId(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
            status: 200,
            success: true,
            data: { order: { _id: '123' } },
            message: 'Order deleted',
        });
    });
});