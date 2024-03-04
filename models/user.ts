import mongoose, {Document, Model, Schema} from "mongoose";
import jwt from "jsonwebtoken"; 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  address: string;
  phone: number;

  generateToken: () => Promise<string>;
  toJSON: () => IUser;
}

interface UserModel extends Model<IUser> {}

const userSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, required: true, trim: true, minlength: 3, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true, trim: true },
        role: { type: String, enum: ["buyer", "seller"], required: true },
        address: { type: String, required: true, trim: true },
        phone: { type: Number, required: true, trim: true },
    },
    {
        timestamps: true,
        collection: "users",
    }
);

userSchema.methods.toJSON = function () {
	const user = this._doc;
	delete user.password;
	return user;
}

const User: UserModel = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;