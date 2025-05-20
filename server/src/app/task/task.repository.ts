import { PrismaClient, Task, TaskStatus, ProgressStatus } from "@prisma/client";
import {
  TaskInput,
  UpdateTaskInput,
  TaskProgressInput,
} from "./task.validator";

const prisma = new PrismaClient();

export async function create(data: TaskInput, userId: string) {
  return prisma.task.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      expectedStartDate: new Date(data.expectedStartDate),
      expectedHours: parseInt(data.expectedHours),
      hourlyRate: parseFloat(data.hourlyRate),
      currency: data.currency,
      status: TaskStatus.OPEN,
      User: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function findById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function findByUserId(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    include: {
      Offer: {
        include: {
          provider: true,
        },
      },
      progress: true,
    },
  });
}

export async function findByProviderId(providerId: string) {
  return prisma.task.findMany({
    where: { providerId },
    include: {
      progress: true,
    },
  });
}

export async function update(id: string, data: UpdateTaskInput) {
  return prisma.task.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      expectedStartDate: new Date(data.expectedStartDate),
      expectedHours: parseInt(data.expectedHours),
      hourlyRate: parseFloat(data.hourlyRate),
      currency: data.currency,
    },
  });
}

export async function updateTask(id: string, data: Partial<Task>) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

export async function markAsCompleted(id: string) {
  return prisma.task.update({
    where: { id },
    data: {
      status: TaskStatus.TASK_COMPLETED,
      completedAt: new Date(),
    },
  });
}

export async function rejectCompletion(id: string) {
  return prisma.task.update({
    where: { id },
    data: {
      status: TaskStatus.IN_PROGRESS,
    },
  });
}

export async function findAll() {
  return prisma.task.findMany({
    include: {
      User: true,
      Offer: true,
    },
  });
}

export async function createTaskProgress(
  taskId: string,
  providerId: string,
  data: TaskProgressInput
) {
  return prisma.taskProgress.create({
    data: {
      description: data.description,
      hoursSpent: data.hoursSpent,
      status: ProgressStatus.IN_PROGRESS,
      task: {
        connect: {
          id: taskId,
        },
      },
      provider: {
        connect: {
          id: providerId,
        },
      },
    },
  });
}
