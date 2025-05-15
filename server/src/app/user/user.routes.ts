import express, { NextFunction } from "express";
import httpStatus from "http-status";
import * as userService from "./user.services";
import { CreateUserRequest, CreateUserResponse } from "./user.types";
import { validateCreateUser } from "./user.validator";
export default function defineUserRoutes(expressApp: express.Application) {
  const userRouter = express.Router();

  // User routes
  userRouter.post(
    "/",
    validateCreateUser,
    async (
      request: CreateUserRequest,
      response: CreateUserResponse,
      next: NextFunction
    ) => {
      try {
        const {
          email,
          password,
          firstName,
          lastName,
          mobileNumber,
          streetNumber,
          streetName,
          city,
          state,
          postCode,
        } = request.body;
        const user = await userService.createUser({
          email,
          password,
          firstName,
          lastName,
          mobileNumber,
          streetNumber,
          streetName,
          city,
          state,
          postCode,
        });
        response.status(httpStatus.OK).send(user);
      } catch (error) {
        next(error);
      }
    }
  );

  // userRouter.get(
  //   "/users",
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       const users = await userService.getAllUsers(
  //         request.query["id"] as string,
  //         request.query
  //       );
  //       response.status(httpStatus.OK).send(users);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // userRouter.get(
  //   "/users/:id",
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       const user = await userService.getUserById(request.params.id);
  //       response.status(httpStatus.OK).send(user);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // userRouter.put(
  //   "/users/:id",
  //   authentication,
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       const user = await userService.updateUser(
  //         request.params.id,
  //         request.body
  //       );
  //       response.status(httpStatus.OK).send(user);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // userRouter.delete(
  //   "/users/:id",
  //   authentication,
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       await userService.deleteUser(request.params.id);
  //       response.status(httpStatus.NO_CONTENT).send();
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  expressApp.use("/api/v1/user", userRouter);
}
