import { Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import { generateToken } from "../../helpers/generateToken";
import { Request } from "../../src/types/request";

export const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let { username, email, password, role, address, phone } = req.body;
    // check if user already exists
    let user = await User.findOne({ email: email });
    if (user) {
      throw new AppError(400, "User already exists", "Create User Error");
    }
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let newUser = await User.create({ username, email, password, role, address, phone });

    // access Token
    const accessToken = await generateToken( newUser );

    sendResponse(res, 200, true, { newUser, accessToken }, null, "User and cart created");
  });

export const getCurrentUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    sendResponse(res, 200, true, user, null, null);
  });

export const updateCurrentUser = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { username, address, phone } = req.body;
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw new AppError(404, "User not found", "Update User Error");
    }
    user.username = username;
    user.address = address;
    user.phone = phone;
    await user.save();
    sendResponse(res, 200, true, { user }, null, "User updated");
  });

export const getAllUsers = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const { page, limit, ...filter } = req.query;

    const filterConditions: { [key: string]: any }[] = [];

    if (filter.username) {
      filterConditions.push({
        username: { $regex: filter.username, $options: "i" },
      });
    }

    const filterCriteria = filterConditions.length > 0 ? { $and: filterConditions } : {};

    const count = await User.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    let users = await User.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);

    sendResponse(res, 200, true, { users, totalPage, count }, null, null);
  });

export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let user = await User.findOne({ _id: id });
    if (!user) {
      throw new AppError(404, "User not found", "Get User Error");
    }
    sendResponse(res, 200, true, { user }, null, null);
  });