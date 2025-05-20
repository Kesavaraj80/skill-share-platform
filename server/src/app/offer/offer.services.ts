import { OfferStatus, TaskStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as providerRepository from "../provider/provider.repository";
import * as taskRepository from "../task/task.repository";
import * as offerRepository from "./offer.repository";
import AppError from "../../utils/exception";

export async function createOffer(
  data: {
    taskId: string;
    hourlyRate: string;
    currency: string;
  },
  id: string
) {
  // Validate task exists and is open
  const task = await taskRepository.findById(data.taskId);
  if (!task) {
    throw new AppError(
      "Task not found",
      "Task not found",
      httpStatus.NOT_FOUND
    );
  }
  if (task.status !== TaskStatus.OPEN) {
    throw new AppError(
      "Can only make offers on open tasks",
      "Can only make offers on open tasks",
      httpStatus.BAD_REQUEST
    );
  }

  // Validate provider exists
  const provider = await providerRepository.getProviderById(id);
  if (!provider) {
    throw new AppError(
      "Provider not found",
      "Provider not found",
      httpStatus.NOT_FOUND
    );
  }

  // Validate hourly rate is positive
  if (parseFloat(data.hourlyRate) <= 0) {
    throw new AppError(
      "Hourly rate must be positive",
      "Hourly rate must be positive",
      httpStatus.BAD_REQUEST
    );
  }

  // Check if provider already has a pending offer for this task
  const existingOffer = await offerRepository.findPendingOffersByTaskId(
    data.taskId
  );
  const hasExistingOffer = existingOffer.some(
    (offer) => offer.providerId === id
  );
  if (hasExistingOffer) {
    throw new AppError(
      "Provider already has a pending offer for this task",
      "Provider already has a pending offer for this task",
      httpStatus.BAD_REQUEST
    );
  }

  return offerRepository.create({
    providerId: id,
    taskId: data.taskId,
    hourlyRate: parseFloat(data.hourlyRate),
    currency: data.currency,
  });
}

export async function getOfferById(id: string | undefined) {
  if (!id) {
    throw new AppError(
      "NOT FOUND",
      "Offer ID is required",
      httpStatus.NOT_FOUND
    );
  }

  const offer = await offerRepository.findById(id);
  if (!offer) {
    throw new AppError("NOT FOUND", "Offer not found", httpStatus.NOT_FOUND);
  }
  return offer;
}

export async function getOffersByTaskId(taskId: string) {
  // Validate task exists
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  return offerRepository.findByTaskId(taskId);
}

export async function getOffersByProviderId(providerId: string) {
  // Validate provider exists
  const provider = await providerRepository.getProviderById(providerId);
  if (!provider) {
    throw new Error("Provider not found");
  }

  return offerRepository.findByProviderId(providerId);
}

export async function acceptOffer(id: string, userId: string) {
  const offer = await offerRepository.findById(id);
  if (!offer) {
    throw new Error("Offer not found");
  }

  // Get task to validate user is the task creator
  const task = await taskRepository.findById(offer.taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  // Only the task creator can accept offers
  if (task.userId !== userId) {
    throw new AppError(
      "Only the task creator can accept offers",
      "Only the task creator can accept offers",
      httpStatus.BAD_REQUEST
    );
  }

  // Can only accept pending offers
  if (offer.status !== OfferStatus.PENDING) {
    throw new AppError(
      "Can only accept pending offers",
      "Can only accept pending offers",
      httpStatus.BAD_REQUEST
    );
  }

  // Check if task already has an accepted offer
  const acceptedOffer = await offerRepository.findAcceptedOfferByTaskId(
    offer.taskId
  );
  if (acceptedOffer) {
    throw new AppError(
      "Task already has an accepted offer",
      "Task already has an accepted offer",
      httpStatus.BAD_REQUEST
    );
  }

  // Accept the offer and update task status
  const [updatedOffer] = await Promise.all([
    offerRepository.acceptOffer(id),
    taskRepository.updateTask(offer.taskId, {
      status: TaskStatus.ACCEPTED,
      providerId: offer.providerId,
    }),
  ]);

  return updatedOffer;
}

export async function rejectOffer(id: string, userId: string) {
  const offer = await offerRepository.findById(id);
  if (!offer) {
    throw new Error("Offer not found");
  }

  // Get task to validate user is the task creator
  const task = await taskRepository.findById(offer.taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  // Only the task creator can reject offers
  if (task.userId !== userId) {
    throw new Error("Only the task creator can reject offers");
  }

  // Can only reject pending offers
  if (offer.status !== OfferStatus.PENDING) {
    throw new Error("Can only reject pending offers");
  }

  return offerRepository.rejectOffer(id);
}
