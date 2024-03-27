import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export class AppError extends Error {
  statusCode: number;
  errorType: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string, errorType: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendResponse = (res: Response, status: number, success: boolean, data: any | null, errors: Record<string, string> | null, message: string | null) => {
    const response: any = {};
    if (success) response.success = success;
    if (data) response.data = data;
    if (errors) response.errors = errors;
    if (message) response.message = message;
    return res.status(status).json(response);
}

export const validateSchema = (schema: ObjectSchema, reqKey: "params" | "body" | "query") => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req[reqKey]);
    if (error) {
      const exception = new AppError(400, error.message, "Bad Request");
      next(exception);
    }
    req[reqKey] = value;
    next();
}

export const catchAsync = (func: Function) => (req: Request, res: Response, next: NextFunction) => func(req, res, next).catch((err: Error) => next(err));
