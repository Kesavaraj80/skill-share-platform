import { ProviderType } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../utils/exception";
import * as providerRepo from "./provider.repository";

export const createProvider = async (data: any) => {
  // Validate provider-specific fields
  if (data.providerType === ProviderType.INDIVIDUAL) {
    if (!data.firstName || !data.lastName || !data.fullName) {
      throw new AppError(
        "VALIDATION ERROR",
        "Individual provider requires first name, last name, and full name",
        httpStatus.BAD_REQUEST
      );
    }
  } else if (data.providerType === ProviderType.COMPANY) {
    if (!data.companyName || !data.businessTaxNumber) {
      throw new AppError(
        "VALIDATION ERROR",
        "Company provider requires company name and business tax number",
        httpStatus.BAD_REQUEST
      );
    }
  }

  return providerRepo.createProvider(data);
};
