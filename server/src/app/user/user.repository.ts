import { Types } from "mongoose";
import User from "./user.model";

export const getUserById = async (_id: Types.ObjectId) =>
  await User.findOne({ _id });

export const getUserByEmail = async (email: string) =>
  await User.findOne({
    email: {
      $regex: `${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      $options: "i",
    },
  });

export const getAllUsers = async (_id: Types.ObjectId) =>
  await User.find({ _id: { $ne: _id } }).select([
    "fullName",
    "lastName",
    "firstName",
  ]);
