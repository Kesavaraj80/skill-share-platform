import { PrismaClient, Role } from "@prisma/client";
import { ProviderInput } from "./provider.validator";
const prisma = new PrismaClient();

export const getProviderById = async (id: string) =>
  await prisma.provider.findUnique({
    where: { id },
    include: {
      skills: true,
    },
  });

export const getProviderByEmail = async (email: string) =>
  await prisma.provider.findUnique({
    where: { email },
    include: {
      skills: true,
      offers: true,
    },
  });

export const createProvider = async (data: ProviderInput) => {
  return prisma.provider.create({
    data: {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
      providerType: data.providerType,
      role: Role.PROVIDER,
      email: data.email,
      password: data.password,
      mobileNumber: data.mobileNumber,
      streetNumber: data.streetNumber,
      streetName: data.streetName,
      city: data.city,
      state: data.state,
      postCode: data.postCode,
      companyName: data.companyName || null,
      businessTaxNumber: data.businessTaxNumber || null,
    },
  });
};
