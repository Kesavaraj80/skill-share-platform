import { PrismaClient } from "@prisma/client";

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

export const createProvider = async (data: any) => {
  return prisma.provider.create({
    data,
    include: {
      skills: true,
    },
  });
};
