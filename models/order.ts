import mongoose, { Document, Model, Schema } from "mongoose";

interface IOrder extends Document {
  userID: string;
  status: string;
  price: number;
  paymentMethod: string;
  isDeleted: boolean;
}

interface OrderModel extends Model<IOrder> {}

const orderSchema: Schema<IOrder> = new Schema(
  {
    userID: { type: String, required: true, trim: true, minlength: 3 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "received"],
      required: true,
      default: "pending",
    },
    price: { type: Number, required: true, trim: true, minlength: 3, default: 0},
    paymentMethod: { type: String, optional: true, trim: true, minlength: 3 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const Order: OrderModel = mongoose.model<IOrder, OrderModel>("Order", orderSchema);
export default Order;
