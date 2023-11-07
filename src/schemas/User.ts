import { Schema, model } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>({
  userID: { required: true, type: String },
  options: {
    link: { type: String, default: process.env.PREFIX },
  },
});

const UserModel = model("user", UserSchema);

export default UserModel;