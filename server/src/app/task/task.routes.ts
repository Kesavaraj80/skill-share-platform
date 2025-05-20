import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import {
  AccessTokenPayload,
  authentication,
} from "../../middleware/middleware";
import {
  createTask,
  getAllTasks,
  getTasksByProviderId,
  getTasksByUserId,
  markTaskAsProviderCompleted,
  updateTask,
  updateTaskProgress,
  acceptTaskCompletion,
  rejectTaskCompletion,
} from "./task.services";
import {
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from "./task.types";
import {
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskProgress,
} from "./task.validator";
import AppError from "../../utils/exception";

export default function defineTaskRoutes(expressApp: express.Application) {
  const taskRouter = express.Router();

  taskRouter.get(
    "/",
    authentication,
    async (_request: Request, response: Response, next: NextFunction) => {
      try {
        const offers = await getAllTasks();
        response.status(httpStatus.OK).send(offers);
      } catch (error) {
        next(error);
      }
    }
  );

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

  taskRouter.get(
    "/provider/:providerId",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const providerId = request.params["providerId"] as string;
        const tasks = await getTasksByProviderId(providerId);
        response.status(httpStatus.OK).send(tasks);
      } catch (error) {
        next(error);
      }
    }
  );

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

  // Update task progress
  taskRouter.post(
    "/:id/progress",
    authentication,
    validateTaskProgress,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { id: providerId } =
          response.locals as unknown as AccessTokenPayload;
        if (!providerId) {
          throw new AppError(
            "Provider ID not found in token",
            "Provider ID not found in token",
            httpStatus.NOT_FOUND
          );
        }
        const taskId = request.params["id"];
        if (!taskId) {
          throw new AppError(
            "Task ID not found in request",
            "Task ID not found in request",
            httpStatus.BAD_REQUEST
          );
        }
        const progress = await updateTaskProgress(
          taskId,
          providerId,
          request.body
        );
        response.status(httpStatus.CREATED).send(progress);
      } catch (error) {
        next(error);
      }
    }
  );

  taskRouter.post(
    "/provider/:providerId/complete",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { id: providerId } =
          response.locals as unknown as AccessTokenPayload;
        if (!providerId) {
          throw new AppError(
            "Provider ID not found in token",
            "Provider ID not found in token",
            httpStatus.NOT_FOUND
          );
        }
        const taskId = request.params["providerId"];
        if (!taskId) {
          throw new AppError(
            "Task ID not found in request",
            "Task ID not found in request",
            httpStatus.BAD_REQUEST
          );
        }
        const task = await markTaskAsProviderCompleted(taskId, providerId);
        response.status(httpStatus.OK).send(task);
      } catch (error) {
        next(error);
      }
    }
  );

  // Accept task completion
  taskRouter.post(
    "/:taskId/accept",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { id: userId } = response.locals as unknown as AccessTokenPayload;
        if (!userId) {
          throw new AppError(
            "User ID not found in token",
            "User ID not found in token",
            httpStatus.NOT_FOUND
          );
        }
        const taskId = request.params["taskId"];
        if (!taskId) {
          throw new AppError(
            "Task ID not found in request",
            "Task ID not found in request",
            httpStatus.BAD_REQUEST
          );
        }
        const task = await acceptTaskCompletion(taskId, userId);
        response.status(httpStatus.OK).send(task);
      } catch (error) {
        next(error);
      }
    }
  );

  // Reject task completion
  taskRouter.post(
    "/:taskId/reject",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { id: userId } = response.locals as unknown as AccessTokenPayload;
        if (!userId) {
          throw new AppError(
            "User ID not found in token",
            "User ID not found in token",
            httpStatus.NOT_FOUND
          );
        }
        const taskId = request.params["taskId"];
        if (!taskId) {
          throw new AppError(
            "Task ID not found in request",
            "Task ID not found in request",
            httpStatus.BAD_REQUEST
          );
        }
        const task = await rejectTaskCompletion(taskId, userId);
        response.status(httpStatus.OK).send(task);
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use("/api/v1/tasks", taskRouter);
}
