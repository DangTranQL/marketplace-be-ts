"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequired = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("./utils");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const loginRequired = (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new utils_1.AppError(401, "Unauthorized", "Login Required");
        }
        const token = tokenString.replace("Bearer ", "");
        jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new utils_1.AppError(401, "Unauthorized", "Token Expired");
                }
                else {
                    throw new utils_1.AppError(401, "Unauthorized", "Invalid Token");
                }
            }
            req.userId = payload._id;
        });
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.loginRequired = loginRequired;
