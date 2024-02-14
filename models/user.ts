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
  isDeleted: boolean;

  generateToken: () => Promise<string>;
  toJSON: () => IUser;
}

interface UserModel extends Model<IUser> {}

const userSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, required: true, trim: true, minlength: 3, unique: true },
        email: { type: String, required: true, trim: true, unique: true },
        password: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        phone: { type: Number, required: true, trim: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: "users",
    }
);

userSchema.methods.toJSON = function () {
	const user = this._doc;
	delete user.password;
	delete user.isDeleted;
	return user;
}

userSchema.methods.generateToken = async function () {
    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
    }
	const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: "1d" });
	return accessToken;
}

const User: UserModel = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;