import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import bcrypt from "bcryptjs";
import User from "../../models/user";
import { generateToken } from "../../helpers/generateToken";

interface UserController {
  createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateCurrentUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const userController: UserController = {
  createUser: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
  }),

  getCurrentUser: catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    sendResponse(res, 200, true, user, null, null);
  }),

  updateCurrentUser: catchAsync(async (req: any, res: Response, next: NextFunction) => {
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
  }),
};

export default userController;