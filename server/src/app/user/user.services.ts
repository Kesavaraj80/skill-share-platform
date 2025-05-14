import httpStatus from "http-status";
import AppError from "../../utils/exception";
import * as userRepo from "./user.repository";
import { signAccessToken } from "./user.helper";
import { Types } from "mongoose";

export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.getUserByEmail(email);

  if (!user) {
    throw new AppError(
      "LOGIN ERROR",
      "Invalid email or password",
      httpStatus.BAD_REQUEST
    );
  }

  if (user.password !== password) {
    throw new AppError(
      "LOGIN ERROR",
      "Invalid email or password",
      httpStatus.UNAUTHORIZED
    );
  }

  const token = signAccessToken({
    userId: user._id as string,
    email: user.email,
  });
  return {
    accessToken: token,
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      wallet: user.wallet,
    },
  };
};

export const getAllPeerUsers = async (userId: Types.ObjectId) =>
  userRepo.getAllUsers(userId);
