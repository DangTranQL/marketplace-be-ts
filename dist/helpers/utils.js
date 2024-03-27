"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.validateSchema = exports.sendResponse = exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, errorType) {
        super(message);
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const sendResponse = (res, status, success, data, errors, message) => {
    const response = {};
    if (success)
        response.success = success;
    if (data)
        response.data = data;
    if (errors)
        response.errors = errors;
    if (message)
        response.message = message;
    return res.status(status).json(response);
};
exports.sendResponse = sendResponse;
const validateSchema = (schema, reqKey) => (req, res, next) => {
    const { value, error } = schema.validate(req[reqKey]);
    if (error) {
        const exception = new AppError(400, error.message, "Bad Request");
        next(exception);
    }
    req[reqKey] = value;
    next();
};
exports.validateSchema = validateSchema;
const catchAsync = (func) => (req, res, next) => func(req, res, next).catch((err) => next(err));
exports.catchAsync = catchAsync;
