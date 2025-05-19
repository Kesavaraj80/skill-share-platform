import * as skillRepository from "./skill.repository";
import AppError from "../../utils/exception";
import httpStatus from "http-status";
import { Skill } from "@prisma/client";
import * as providerRepository from "../provider/provider.repository";
import { SkillInput } from "./skill.validator";

// Validation functions
function validateId(id: string | undefined): string {
  if (!id) {
    throw new AppError(
      "VALIDATION ERROR",
      "ID is required",
      httpStatus.BAD_REQUEST
    );
  }
  return id;
}

function validateProviderId(providerId: string | undefined): string {
  if (!providerId) {
    throw new AppError(
      "VALIDATION ERROR",
      "Provider ID is required",
      httpStatus.BAD_REQUEST
    );
  }
  return providerId;
}

export async function createSkill(
  data: SkillInput,
  providerId: string
): Promise<Skill> {
  // Validate required fields
  return skillRepository.create({
    category: data.category,
    providerId,
    experience: parseInt(data.experience),
    workNature: data.workNature,
    hourlyRate: parseFloat(data.hourlyRate),
    currency: data.currency,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function getSkillsByProviderId(
  providerId: string | undefined
): Promise<Skill[]> {
  const validatedProviderId = validateProviderId(providerId);
  // Validate provider exists
  const provider =
    await providerRepository.getProviderById(validatedProviderId);
  if (!provider) {
    throw new AppError("NOT FOUND", "Provider not found", httpStatus.NOT_FOUND);
  }

  return skillRepository.findByProviderId(validatedProviderId);
}

export async function updateSkill(
  id: string,
  data: SkillInput,
  providerId: string
): Promise<Skill | null> {
  const skill = await skillRepository.findById(id);
  if (!skill) {
    throw new AppError("NOT FOUND", "Skill not found", httpStatus.NOT_FOUND);
  }

  // Only the provider who owns the skill can update it
  if (skill.providerId.toString() !== providerId) {
    throw new AppError(
      "FORBIDDEN",
      "Only the skill owner can update the skill",
      httpStatus.FORBIDDEN
    );
  }

  // Validate experience is non-negative if being updated
  if (data.experience !== undefined && parseInt(data.experience) < 0) {
    throw new AppError(
      "VALIDATION ERROR",
      "Experience cannot be negative",
      httpStatus.BAD_REQUEST
    );
  }

  // Validate hourly rate is positive if being updated
  if (data.hourlyRate !== undefined && parseFloat(data.hourlyRate) <= 0) {
    throw new AppError(
      "VALIDATION ERROR",
      "Hourly rate must be positive",
      httpStatus.BAD_REQUEST
    );
  }

  return skillRepository.update(id, {
    category: data.category,
    experience: parseInt(data.experience),
    workNature: data.workNature,
    hourlyRate: parseFloat(data.hourlyRate),
    currency: data.currency,
  });
}

export async function deleteSkill(
  id: string | undefined,
  providerId: string
): Promise<Skill | null> {
  const validatedId = validateId(id);
  const skill = await skillRepository.findById(validatedId);
  if (!skill) {
    throw new AppError("NOT FOUND", "Skill not found", httpStatus.NOT_FOUND);
  }

  // Only the provider who owns the skill can delete it
  if (skill.providerId.toString() !== providerId) {
    throw new AppError(
      "FORBIDDEN",
      "Only the skill owner can delete the skill",
      httpStatus.FORBIDDEN
    );
  }

  return skillRepository.deleteSkill(validatedId);
}
