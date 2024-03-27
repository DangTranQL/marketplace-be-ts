import jwt from 'jsonwebtoken';
import { AppError } from './utils';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export const loginRequired = (req: any, res: any, next: any) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new AppError(401, "Unauthorized", "Login Required");
        }
        
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (err: any, payload: any) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new AppError(401, "Unauthorized", "Token Expired");
                } else {
                    throw new AppError(401, "Unauthorized", "Invalid Token");
                }
            }

            req.userId = payload._id;
        });
        next();
    } catch (error) {
        next(error);
    }
}

export const adminRequired = (req: any, res: any, next: any) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new AppError(401, "Unauthorized", "Login Required");
        }
        
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (err: any, payload: any) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new AppError(401, "Unauthorized", "Token Expired");
                } else {
                    throw new AppError(401, "Unauthorized", "Invalid Token");
                }
            }

            if (payload.role !== "admin") {
                throw new AppError(403, "Forbidden", "Admin Required");
            }

            req.userId = payload._id;
        });
        next();
    } catch (error) {
        next(error);
    }
}