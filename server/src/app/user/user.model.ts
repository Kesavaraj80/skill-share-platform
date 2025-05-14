import { Document, model, Model, Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  wallet: number;
}

export interface IUserDoc extends IUser, Document {}

interface IUserModel extends Model<IUserDoc> {}

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: "_docVersion",
    timestamps: { currentTime: () => new Date() },
  }
);

const User = model<IUserDoc, IUserModel>("User", userSchema);

export default User;
