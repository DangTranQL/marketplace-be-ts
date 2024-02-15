import { Request, Response, NextFunction } from "express";
import userController from "./user.controller";
import User from '../../models/user';
import Order from '../../models/order';
import OrderItem from '../../models/orderItem';
import bcrypt from 'bcryptjs';

jest.mock('../../models/user');
jest.mock('../../models/order');
jest.mock('../../models/orderItem');
jest.mock('bcryptjs');

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'user',
          address: '123 Test St',
          phone: '1234567890',
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
  });

  // createUser test
  it('should create a new user', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    const newUser = {
      ...req.body,
      password: 'hashedpassword',
      generateToken: jest.fn().mockResolvedValue('token'),
    };
    (User.create as jest.Mock).mockResolvedValue(newUser);

    await userController.createUser(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      success: true,
      data: { newUser, accessToken: 'token' },
      message: "User and cart created"
    });
  });

  // getUsers test
  it('should get users', async () => {
    req.query = {
        page: '1',
        limit: '10',
        username: 'testuser',
    };

    const users = [
        { username: 'testuser', email: 'test@example.com' },
      ];
      (User.countDocuments as jest.Mock).mockResolvedValue(users.length);
      (User.find as jest.Mock).mockResolvedValue(users);
    
      await userController.getUsers(req as Request, res as Response, next);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: { users, totalPages: 1, count: users.length },
        message: null
      });
  });

  // getUserById test
  it('should get user by id', async () => {
    req.params = {
        id: '123',
      };
    
      const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(user);
    
      await userController.getUserById(req as Request, res as Response, next);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: { user },
        message: null
      });
  });

  // updateUserById test
  it('should update user by id', async () => {
    req.params = {
        id: '123',
      };
      req.body = {
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'password123',
        role: 'buyer',
        address: '123 Test St',
        phone: '1234567890',
      };

      const user = { _id: '123', username: 'testuser2', email: 'testuser2@example.com', password: 'password123', role: 'buyer', address: '123 Test St', phone: '1234567890' };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (User.prototype.save as jest.Mock).mockResolvedValue(user);

      await userController.updateUserById(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: { user },
        message: "User updated"
      });
  });

  // createOrderItem test
  it('should create order item', async () => {
    req.params = {
        id: '123',
      };
      req.body = {
        productID: '456',
        quantity: 2,
        price: 100,
      };
    
      const order = { _id: '789', userID: '123', status: 'pending', price: 0 };
      const orderItem = { orderID: '789', productID: '456', quantity: 2, itemPrice: 100 };
      (Order.findOne as jest.Mock).mockResolvedValue(order);
      (OrderItem.findOne as jest.Mock).mockResolvedValue(null);
      (OrderItem.create as jest.Mock).mockResolvedValue(orderItem);
    
      await userController.createOrderItem(req as Request, res as Response, next);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: { order },
        message: "Product added to order"
      });
  });

  // getOrder test
  it('should get order', async () => {
    req.params = {
        id: '123',
      };
    
      const order = { _id: '789', userID: '123', status: 'pending', price: 0 };
      const orderItems = [
        { orderID: '789', productID: '456', quantity: 2, itemPrice: 100 },
      ];
      (Order.findOne as jest.Mock).mockResolvedValue(order);
      (OrderItem.find as jest.Mock).mockResolvedValue(orderItems);
    
      await userController.getOrder(req as Request, res as Response, next);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: { order: order, orderItems: orderItems },
        message: null
      });
  });

  // deleteUserById test
  it('should delete user by id', async () => {
    req.params = {
        id: '123',
      };
    
      const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (OrderItem.deleteMany as jest.Mock).mockResolvedValue({ ok: 1 });
      (Order.deleteOne as jest.Mock).mockResolvedValue({ ok: 1 });
      (User.deleteOne as jest.Mock).mockResolvedValue({ ok: 1 });
    
      await userController.deleteUserById(req as Request, res as Response, next);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: null,
        message: "User deleted"
      });
  });

  // deleteUserByUsername test
  it('should delete user by username', async () => {
    req.params = {
        username: 'testuser',
      };
    
      const user = { _id: '123', username: 'testuser', email: 'test@example.com' };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (OrderItem.deleteMany as jest.Mock).mockResolvedValue({ ok: 1 });
      (Order.deleteOne as jest.Mock).mockResolvedValue({ ok: 1 });
      (User.deleteOne as jest.Mock).mockResolvedValue({ ok: 1 });
    
      await userController.deleteUserByUsername(req as Request, res as Response, next);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: null,
        message: "User deleted"
      });
  });

  // deleteAllUsers test
  it('should delete all users', async () => {
    (User.deleteMany as jest.Mock).mockResolvedValue({ ok: 1 });
    (Order.deleteMany as jest.Mock).mockResolvedValue({ ok: 1 });
    (OrderItem.deleteMany as jest.Mock).mockResolvedValue({ ok: 1 });

    await userController.deleteAllUsers(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: null,
        message: "All users deleted"
    });
    });
});