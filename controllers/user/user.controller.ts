import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import Order from "../../models/order";
import OrderItem from "../../models/orderItem";
import { get } from "mongoose";

interface UserController {
  createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  createOrderItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteUserByUsername: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

type userConditionType = {
  isDeleted: boolean;
  username?: { $regex: string, $options: string };
};

const userController: UserController = {
  createUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let { username, email, password, role, address, phone } = req.body;
    // check if user already exists
    let user = await User.findOne({ email: email, isDeleted: false });
    if (user) {
      throw new AppError(400, "User already exists", "Create User Error");
    }
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let newUser = await User.create({ username, email, password, role, address, phone });

    const accessToken = await newUser.generateToken();

    sendResponse(res, 200, true, { newUser, accessToken }, null, "User and cart created");
  }),

  getUsers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let { page: pageQuery, limit: limitQuery, ...filter } = req.query;

    const page = parseInt(pageQuery as string) || 1;
    const limit = parseInt(limitQuery as string) || 10;

    const filterCondition: userConditionType[] = [];
    if (filter.username) {
      filterCondition.push({
        isDeleted: false,
        username: { $regex: filter.username as string, $options: "i" },
      });
    }

    const filterCriteria = filterCondition.length ? { $and: filterCondition } : {};

    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    let users = await User.find(filterCriteria).sort({ createdAt: -1 }).skip(offset).limit(limit);

    sendResponse(res, 200, true, { users, totalPages, count }, null, null);
  }),

  getCurrentUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.userId;
    sendResponse(res, 200, true, { user }, null, null);
  }),

  getUserById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      throw new AppError(404, "User not found", "Get User Error");
    }
    sendResponse(res, 200, true, { user }, null, null);
  }),

  updateUserById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { username, email, password, role, address, phone } = req.body;
    let user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      throw new AppError(404, "User not found", "Update User Error");
    }
    user.username = username;
    user.email = email;
    user.password = password;
    user.role = role;
    user.address = address;
    user.phone = phone;
    await user.save();

    sendResponse(res, 200, true, { user }, null, "User updated");
  }),

  createOrderItem: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productID, title, quantity, price, image } = req.body;
    let order = await Order.findOne({ userID: id, status: "pending", isDeleted: false });
    if (!order) {
      order = await Order.create({ userID: id, status: "pending", price: 0 });
    }

    let orderPrice = order.price;
    let item = await OrderItem.findOne({ orderID: order._id, productID: productID });
    if (item) {
      item.quantity += quantity;
    } else {
      await OrderItem.create({ orderID: order._id, productID: productID, title: title, quantity: quantity, itemPrice: price, image: image});
      orderPrice += price * quantity;
    }

    order.price = orderPrice;
    await order.save();
    sendResponse(res, 200, true, { order }, null, "Product added to order");
  }),

  getOrder: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let order = await Order.findOne({ userID: id, status: "pending", isDeleted: false });
    if (!order) {
      throw new AppError(404, "Order not found", "Get Order Error");
    }
    let orderItems = await OrderItem.find({ orderID: order._id });
    let response = {
      order: order,
      orderItems: orderItems,
    };
    sendResponse(res, 200, true, response, null, null);
  }),

  deleteUserById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) {
      throw new AppError(404, "User not found", "Delete User Error");
    } else {
      await OrderItem.deleteMany({ orderID: id });
      await Order.deleteOne({ userID: id });
      await User.deleteOne({ _id: id });
    }
    sendResponse(res, 200, true, null, null, "User deleted");
  }),

  deleteUserByUsername: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    let user = await User.findOne({ username: username, isDeleted: false });
    if (!user) {
      throw new AppError(404, "User not found", "Delete User Error");
    } else {
      await OrderItem.deleteMany({ orderID: user._id });
      await Order.deleteOne({ userID: user._id });
      await User.deleteOne({ username: username });
    }
    sendResponse(res, 200, true, null, null, "User deleted");
  }),

  deleteAllUsers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await User.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    sendResponse(res, 200, true, null, null, "All users deleted");
  }),
};

export default userController;