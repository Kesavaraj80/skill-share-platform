import { User } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../utils/exception";
import * as userRepo from "./user.repository";
import { createUserInput } from "./user.validator";

export const createUser = async (data: createUserInput): Promise<User> => {
  return userRepo.createUser(data);
};

// export const updateUser = async (id: string, data: any) => {
//   return userRepo.updateUser(id, data);
// };

// export const deleteUser = async (id: string) => {
//   return userRepo.deleteUser(id);
// };

export const getUserById = async (id: string): Promise<User> => {
  const user = await userRepo.getUserById(id);
  if (!user) {
    throw new AppError("NOT FOUND", "User not found", httpStatus.NOT_FOUND);
  }
  return user;
};

export const getUserByEmail = async (email: string): Promise<User> => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) {
    throw new AppError("NOT FOUND", "User not found", httpStatus.NOT_FOUND);
  }
  return user;
};

// export const getAllUsers = async (
//   id: string,
//   filters?: {
//     role?: string;
//     search?: string;
//     page?: number;
//     limit?: number;
//   }
// ) => {
//   return userRepo.getAllUsers(id, filters);
// };
