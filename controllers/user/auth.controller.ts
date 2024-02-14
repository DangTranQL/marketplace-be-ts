import { Request, Response, NextFunction } from "express";
import { sendResponse, AppError, catchAsync } from "../../helpers/utils";
import bcrypt from 'bcryptjs';
import User from '../../models/user';

interface AuthController {
  loginWithEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const authController: AuthController = {
  loginWithEmail: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }, "+password") as any;
    if (!user) {
      throw new AppError(400, "Invalid Credentials!", "Login Error");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Incorrect Password!", "Login Error");
    }

    const accessToken = await user.generateToken();
    sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
  }),
};

export default authController;