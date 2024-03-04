"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const order_1 = __importDefault(require("../models/order"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const generateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
    }
    const order = yield order_1.default.findOne({ _id: payload._id, status: "pending" });
    const accessToken = yield jsonwebtoken_1.default.sign({ _id: payload._id, role: payload.role, pendingOrder: order }, JWT_SECRET_KEY, { expiresIn: "1d" });
    console.log("TOKEN", accessToken);
    return accessToken;
});
exports.generateToken = generateToken;
