import * as providerRepo from "./provider.repository";

export const createProvider = async (data: any) => {
  return providerRepo.createProvider(data);
};
