import { PrismaClient, TaskStatus } from "@prisma/client";
import { TaskInput, UpdateTaskInput } from "./task.validator";

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

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

export async function markAsCompleted(id: string) {
  return prisma.task.update({
    where: { id },
    data: {
      status: TaskStatus.COMPLETED,
      completedAt: new Date(),
    },
  });
}

export async function acceptCompletion(id: string) {
  return prisma.task.update({
    where: { id },
    data: {
      status: TaskStatus.ACCEPTED,
      acceptedAt: new Date(),
    },
  });
}

export async function rejectCompletion(id: string) {
  return prisma.task.update({
    where: { id },
    data: {
      status: TaskStatus.IN_PROGRESS,
      completedAt: null,
    },
  });
}
