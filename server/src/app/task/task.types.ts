import { User } from "@prisma/client";
import { Request, Response } from "express";
import { TaskInput } from "./task.validator";

// Create task request and response types
export interface CreateTaskRequest extends Request {
  body: TaskInput;
}

export type CreateTaskResponse = Response<unknown, { user: User }>;

// Update task request and response types
export interface UpdateTaskRequest extends Request {
  params: {
    id: string;
  };
  body: TaskInput;
}

export type UpdateTaskResponse = Response<unknown, { user: User }>;
