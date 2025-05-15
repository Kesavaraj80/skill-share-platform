import { Task, TaskStatus } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../utils/exception";
import * as taskRepository from "./task.repository";
import { TaskInput, UpdateTaskInput } from "./task.validator";

export async function createTask(
  data: TaskInput,
  userId: string
): Promise<Task> {
  return taskRepository.create(data, userId);
}

export async function getTasksByUserId(userId: string): Promise<Task[]> {
  return taskRepository.findByUserId(userId);
}

export async function updateTask(taskId: string, data: UpdateTaskInput) {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new AppError("NOT FOUND", "Task not found", httpStatus.NOT_FOUND);
  }

  // Cannot update task if it's already in progress or completed
  if (task.status !== TaskStatus.OPEN) {
    throw new AppError(
      "CONFLICT",
      "Cannot update task that is already in progress or completed",
      httpStatus.CONFLICT
    );
  }

  return taskRepository.update(taskId, data);
}
