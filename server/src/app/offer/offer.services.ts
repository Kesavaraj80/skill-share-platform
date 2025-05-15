import { OfferStatus, TaskStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as providerRepository from "../provider/provider.repository";
import * as taskRepository from "../task/task.repository";
import * as offerRepository from "./offer.repository";
import AppError from "../../utils/exception";

export async function createOffer(data: {
  taskId: string;
  providerId: string;
  hourlyRate: number;
  currency: string;
}) {
  // Validate required fields
  if (!data.taskId || !data.providerId || !data.hourlyRate || !data.currency) {
    throw new Error("Missing required fields for offer creation");
  }

  // Validate task exists and is open
  const task = await taskRepository.findById(data.taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  if (task.status !== TaskStatus.OPEN) {
    throw new Error("Can only make offers on open tasks");
  }

  // Validate provider exists
  const provider = await providerRepository.findById(data.providerId);
  if (!provider) {
    throw new Error("Provider not found");
  }

  // Validate hourly rate is positive
  if (data.hourlyRate <= 0) {
    throw new Error("Hourly rate must be positive");
  }

  // Check if provider already has a pending offer for this task
  const existingOffer = await offerRepository.findPendingOffersByTaskId(
    data.taskId
  );
  const hasExistingOffer = existingOffer.some(
    (offer) => offer.providerId === data.providerId
  );
  if (hasExistingOffer) {
    throw new Error("Provider already has a pending offer for this task");
  }

  return offerRepository.create(data);
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
  const provider = await providerRepository.findById(providerId);
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
    throw new Error("Only the task creator can accept offers");
  }

  // Can only accept pending offers
  if (offer.status !== OfferStatus.PENDING) {
    throw new Error("Can only accept pending offers");
  }

  // Check if task already has an accepted offer
  const acceptedOffer = await offerRepository.findAcceptedOfferByTaskId(
    offer.taskId
  );
  if (acceptedOffer) {
    throw new Error("Task already has an accepted offer");
  }

  // Accept the offer and update task status
  const [updatedOffer] = await Promise.all([
    offerRepository.acceptOffer(id),
    taskRepository.update(offer.taskId, {
      status: TaskStatus.IN_PROGRESS,
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
