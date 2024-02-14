import mongoose, { Document, Model, Schema } from "mongoose";

interface IOrderItem extends Document {
  orderID: string;
  productID: string;
  quantity: number;
  itemPrice: number;
  isDeleted: boolean;
}

interface OrderItemModel extends Model<IOrderItem> {}

const orderItemSchema: Schema<IOrderItem> = new Schema(
  {
    orderID: { type: String, required: true, trim: true, minlength: 3 },
    productID: { type: String, required: true, trim: true, minlength: 3 },
    quantity: { type: Number, required: true, trim: true, minlength: 1 },
    itemPrice: { type: Number, required: true, trim: true, minlength: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'orderitems',
  }
);

const OrderItem: OrderItemModel = mongoose.model<IOrderItem, OrderItemModel>('OrderItem', orderItemSchema);
export default OrderItem;
