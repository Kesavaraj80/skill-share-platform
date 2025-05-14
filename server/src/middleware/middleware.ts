import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { IUserDoc } from "../app/user/user.model";
import AppError from "../utils/exception";
import { verifyAccessToken } from "../app/user/user.helper";
import { getUserById } from "../app/user/user.repository";

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
        const user = await getUserById(
          payload.userId as unknown as Types.ObjectId
        );

        if (!user) {
          reject(
            new AppError(
              "UNAUTHORIZED",
              "UNAUTHORIZED",
              httpStatus.UNAUTHORIZED
            )
          );
          return null;
        }

        response.locals["user"] = user as IUserDoc;
        resolve();
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
