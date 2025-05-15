import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { verifyAccessToken } from "../app/user/user.helper";
import { getUserById } from "../app/user/user.repository";
import { getProviderById } from "../app/provider/provider.repository";
import AppError from "../utils/exception";
import { User, Provider } from "@prisma/client";

export const authentication = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const authHeader = request.headers.authorization as string;
      const token = authHeader.split(" ")[1];
      if (!token) {
        reject(
          new AppError("UNAUTHORIZED", "UNAUTHORIZED", httpStatus.UNAUTHORIZED)
        );
        return null;
      }

      const payload = verifyAccessToken(token);

      if (payload) {
        // Try to find user first
        const user = await getUserById(payload.userId.toString());
        if (user) {
          response.locals["user"] = user as User;
          resolve();
          return null;
        }

        // If user not found, try to find provider
        const provider = await getProviderById(payload.userId.toString());
        if (provider) {
          response.locals["provider"] = provider as Provider;
          resolve();
          return null;
        }

        reject(
          new AppError("UNAUTHORIZED", "UNAUTHORIZED", httpStatus.UNAUTHORIZED)
        );
        return null;
      }

      reject(
        new AppError("UNAUTHORIZED", "UNAUTHORIZED", httpStatus.UNAUTHORIZED)
      );
      return null;
    } catch (error) {
      reject(
        new AppError("UNAUTHORIZED", "UNAUTHORIZED", httpStatus.UNAUTHORIZED)
      );
      return null;
    }
  })
    .then(() => {
      next();
    })
    .catch((error) => {
      next(error);
    });
};
