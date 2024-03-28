import mongoose, { Document, Model, Schema } from "mongoose";

interface IOrderItem extends Document {
  orderID: string;
  productID: string;
  title: string;
  quantity: number;
  itemPrice: number;
  image: string;
}

interface OrderItemModel extends Model<IOrderItem> {}

const orderItemSchema: Schema<IOrderItem> = new Schema(
  {
    orderID: { type: String, required: true, trim: true, minlength: 3 },
    productID: { type: String, required: true, trim: true, minlength: 3 },
    title: { type: String, required: true, trim: true, minlength: 3 },
    quantity: { type: Number, required: true, trim: true, minlength: 1 },
    itemPrice: { type: Number, required: true, trim: true, minlength: 1 },
    image: { type: String, required: true, trim: true, minlength: 3 },
  },
  {
    timestamps: true,
    collection: 'orderitems',
  }
);

const OrderItem: OrderItemModel = mongoose.model<IOrderItem, OrderItemModel>('OrderItem', orderItemSchema);
export default OrderItem;
