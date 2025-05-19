import { PrismaClient, Skill } from "@prisma/client";
const prisma = new PrismaClient();

export async function create(data: Omit<Skill, "id">) {
  return prisma.skill.create({
    data,
  });
}

export async function findById(id: string) {
  return prisma.skill.findUnique({
    where: {
      id,
    },
  });
}

export async function findByProviderId(providerId: string) {
  return prisma.skill.findMany({
    where: {
      providerId,
    },
  });
}

export async function deleteSkill(id: string) {
  return prisma.skill.delete({
    where: {
      id,
    },
  });
}

export async function update(id: string, data: Partial<Skill>) {
  return prisma.skill.update({
    where: { id },
    data,
  });
}
