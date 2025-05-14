import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { authentication } from "../../middleware/middleware";
import { IUserDoc } from "./user.model";
import * as userService from "./user.services";
import { Types } from "mongoose";

export default function defineUserRoutes(expressApp: express.Application) {
  const userRouter = express.Router();

  userRouter.get(
    "/",
    authentication,
    async (_request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = response.locals as { user: IUserDoc };

        const userId = user._id as Types.ObjectId;
        const data = await userService.getAllPeerUsers(userId);
        response.status(httpStatus.OK).send({ usersList: data });
      } catch (error) {
        next(error);
      }
    }
  );

  userRouter.post(
    "/login",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { email, password } = request.body;
        const { accessToken, user } = await userService.loginUser(
          email,
          password
        );
        response.status(httpStatus.OK).send({ accessToken, user });
      } catch (error) {
        next(error);
      }
    }
  );

  userRouter.get(
    "/me",
    authentication,
    async (_request: Request, response: Response, next: NextFunction) => {
      try {
        const user = response.locals as IUserDoc;
        const userData = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          fullName: user.fullName,
        };
        response.status(httpStatus.OK).send({ ...userData });
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use("/api/v1/user", userRouter);
}
