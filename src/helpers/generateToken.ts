import jwt from 'jsonwebtoken';
import Order from '../models/order';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const generateToken = async (payload: any) => {
    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
    }
    const order = await Order.findOne({ _id: payload._id, status: "pending" });
	const accessToken = await jwt.sign({ _id: payload._id, role: payload.role, pendingOrder: order }, JWT_SECRET_KEY, { expiresIn: "1d" });
    console.log("TOKEN", accessToken)
	return accessToken;
}