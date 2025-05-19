import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { getProviderById } from "../app/provider/provider.repository";
import { verifyAccessToken } from "../app/user/user.helper";
import { getUserById } from "../app/user/user.repository";
import AppError from "../utils/exception";

export interface AccessTokenPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  role: string;
}

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
          response.locals = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          } as AccessTokenPayload;
          resolve();
          return null;
        }

        // If user not found, try to find provider
        const provider = await getProviderById(payload.userId.toString());
        if (provider) {
          response.locals = {
            id: provider.id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            fullName: provider.fullName,
            role: provider.role,
          } as AccessTokenPayload;
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
