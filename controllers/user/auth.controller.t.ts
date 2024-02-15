import { Request, Response, NextFunction } from "express";
import authController from "./auth.controller";
import User from '../../models/user';
import bcrypt from 'bcryptjs';

jest.mock('../../models/user');
jest.mock('bcryptjs');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should login with email', async () => {
    const user = {
      email: 'test@example.com',
      password: 'hashedpassword',
      generateToken: jest.fn().mockResolvedValue('token'),
    };
    (User.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await authController.loginWithEmail(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      success: true,
      data: { user, accessToken: 'token' },
      message: "Login successful"
    });
  });
});