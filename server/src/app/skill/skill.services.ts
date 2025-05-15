import * as skillRepository from "./skill.repository";
import AppError from "../../utils/exception";
import httpStatus from "http-status";
import { Skill } from "@prisma/client";
import * as providerRepository from "../provider/provider.repository";

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

function validateCategory(category: string | undefined): string {
  if (!category) {
    throw new AppError(
      "VALIDATION ERROR",
      "Category is required",
      httpStatus.BAD_REQUEST
    );
  }
  return category;
}

export async function createSkill(data: Partial<Skill>): Promise<Skill> {
  // Validate required fields
  if (
    !data.category ||
    !data.experience ||
    !data.workNature ||
    !data.hourlyRate ||
    !data.providerId
  ) {
    throw new AppError(
      "VALIDATION ERROR",
      "Missing required fields for skill creation",
      httpStatus.BAD_REQUEST
    );
  }

  // Validate provider exists
  const provider = await providerRepository.getProviderById(
    data.providerId.toString()
  );
  if (!provider) {
    throw new AppError("NOT FOUND", "Provider not found", httpStatus.NOT_FOUND);
  }

  // Validate experience is non-negative
  if (data.experience < 0) {
    throw new AppError(
      "VALIDATION ERROR",
      "Experience cannot be negative",
      httpStatus.BAD_REQUEST
    );
  }

  // Validate hourly rate is positive
  if (data.hourlyRate <= 0) {
    throw new AppError(
      "VALIDATION ERROR",
      "Hourly rate must be positive",
      httpStatus.BAD_REQUEST
    );
  }

  return skillRepository.create(data);
}

export async function getSkillById(
  id: string | undefined
): Promise<Skill | null> {
  const validatedId = validateId(id);
  const skill = await skillRepository.findById(validatedId);
  if (!skill) {
    throw new AppError("NOT FOUND", "Skill not found", httpStatus.NOT_FOUND);
  }
  return skill;
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
  id: string | undefined,
  data: Partial<Skill>,
  providerId: string
): Promise<Skill | null> {
  const validatedId = validateId(id);
  const skill = await skillRepository.findById(validatedId);
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
  if (data.experience !== undefined && data.experience < 0) {
    throw new AppError(
      "VALIDATION ERROR",
      "Experience cannot be negative",
      httpStatus.BAD_REQUEST
    );
  }

  // Validate hourly rate is positive if being updated
  if (data.hourlyRate !== undefined && data.hourlyRate <= 0) {
    throw new AppError(
      "VALIDATION ERROR",
      "Hourly rate must be positive",
      httpStatus.BAD_REQUEST
    );
  }

  return skillRepository.update(validatedId, data);
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

export async function getSkillsByCategory(
  category: string | undefined
): Promise<Skill[]> {
  const validatedCategory = validateCategory(category);
  return skillRepository.findByCategory(validatedCategory);
}

export async function getSkillsByProviderAndCategory(
  providerId: string | undefined,
  category: string | undefined
): Promise<Skill[]> {
  const validatedProviderId = validateProviderId(providerId);
  const validatedCategory = validateCategory(category);

  // Validate provider exists
  const provider =
    await providerRepository.getProviderById(validatedProviderId);
  if (!provider) {
    throw new AppError("NOT FOUND", "Provider not found", httpStatus.NOT_FOUND);
  }

  return skillRepository.findByProviderAndCategory(
    validatedProviderId,
    validatedCategory
  );
}
