import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import {
  AccessTokenPayload,
  authentication,
} from "../../middleware/middleware";
import { createTask, getTasksByUserId, updateTask } from "./task.services";
import {
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from "./task.types";
import { validateTaskCreate, validateTaskUpdate } from "./task.validator";

export default function defineTaskRoutes(expressApp: express.Application) {
  const taskRouter = express.Router();

  // Create a new task
  taskRouter.post(
    "/",
    authentication,
    validateTaskCreate,
    async (
      request: CreateTaskRequest,
      response: CreateTaskResponse,
      next: NextFunction
    ) => {
      try {
        const { id } = response.locals as unknown as AccessTokenPayload;
        const task = await createTask(request.body, id);
        response.status(httpStatus.CREATED).send(task);
      } catch (error) {
        next(error);
      }
    }
  );

  // Get tasks by user ID
  taskRouter.get(
    "/user/:userId",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const userId = request.params["userId"];
        const tasks = await getTasksByUserId(userId as string);
        response.status(httpStatus.OK).send(tasks);
      } catch (error) {
        next(error);
      }
    }
  );

  // taskRouter.get(
  //   "/provider/:providerId",
  //   authentication,
  //   async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //       const providerId = request.params["providerId"];
  //       const tasks = await getTasksByProviderId(providerId);
  //       response.status(httpStatus.OK).send(tasks);
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // Update task
  taskRouter.put(
    "/:id",
    authentication,
    validateTaskUpdate,
    async (
      request: UpdateTaskRequest,
      response: UpdateTaskResponse,
      next: NextFunction
    ) => {
      try {
        const id = request.params["id"];
        const task = await updateTask(id, request.body);
        response.status(httpStatus.OK).send(task);
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use("/api/v1/tasks", taskRouter);
}
