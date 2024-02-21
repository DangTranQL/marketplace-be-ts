import mongoose, { Document, Model, Schema } from "mongoose";

interface IProduct extends Document {
  title: string;
  description: string;
  category: string;
  stocks: number;
  price: number;
  image: string;
  sold: number;
  totalRating: number;
  totalReview: number;
  isDeleted: boolean;
}

interface ProductModel extends Model<IProduct> {}

const productSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, unique: true },
    description: { type: String, required: true, trim: true, minlength: 3 },
    category: {type: String, enum: ['Electronics', 'Clothing', 'Medicine', 'Food', 'Others'], required: true, trim: true, minlength: 3},
    stocks: { type: Number, required: true, trim: true },
    price: { type: Number, required: true, trim: true, unique: true },
    image: { type: String, required: true, trim: true, minlength: 3 },
    sold: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    totalReview: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

const Product: ProductModel = mongoose.model<IProduct, ProductModel>("Product", productSchema);
export default Product;
