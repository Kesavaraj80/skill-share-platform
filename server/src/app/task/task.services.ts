import { Task, TaskStatus } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../utils/exception";
import * as taskRepository from "./task.repository";
import {
  TaskInput,
  UpdateTaskInput,
  TaskProgressInput,
} from "./task.validator";

export async function createTask(
  data: TaskInput,
  userId: string
): Promise<Task> {
  return taskRepository.create(data, userId);
}

export async function getTasksByUserId(userId: string): Promise<Task[]> {
  return taskRepository.findByUserId(userId);
}

export async function getTasksByProviderId(
  providerId: string
): Promise<Task[]> {
  return taskRepository.findByProviderId(providerId);
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

export async function getAllTasks() {
  return taskRepository.findAll();
}

export async function updateTaskProgress(
  taskId: string,
  providerId: string,
  data: TaskProgressInput
) {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new AppError("NOT FOUND", "Task not found", httpStatus.NOT_FOUND);
  }

  // Verify that the provider is assigned to this task
  if (task.providerId !== providerId) {
    throw new AppError(
      "FORBIDDEN",
      "You are not authorized to update this task",
      httpStatus.FORBIDDEN
    );
  }

  await taskRepository.updateTask(taskId, {
    status: TaskStatus.IN_PROGRESS,
  });

  return taskRepository.createTaskProgress(taskId, providerId, data);
}

export async function markTaskAsProviderCompleted(
  taskId: string,
  providerId: string
) {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new AppError("NOT FOUND", "Task not found", httpStatus.NOT_FOUND);
  }

  if (task.providerId !== providerId) {
    throw new AppError(
      "FORBIDDEN",
      "You are not authorized to complete this task",
      httpStatus.FORBIDDEN
    );
  }

  await taskRepository.updateTask(taskId, {
    status: TaskStatus.PROVIDER_COMPLETED,
  });
}
