import { PrismaClient, User } from "@prisma/client";
import { createUserInput } from "./user.validator";

const prisma = new PrismaClient();

export const getUserById = async (id: string): Promise<User | null> =>
  await prisma.user.findUnique({
    where: { id },
    include: {
      tasks: true,
    },
  });

export const getUserByEmail = async (email: string): Promise<User | null> =>
  await prisma.user.findUnique({
    where: { email },
    include: {
      tasks: true,
    },
  });

// export const getAllUsers = async (
//   id: string,
//   filters?: {
//     role?: string;
//     search?: string;
//     page?: number;
//     limit?: number;
//   }
// ) => {
//   const where = {
//     id: { not: id },
//     ...(filters?.role && { role: filters.role }),
//     ...(filters?.search && {
//       OR: [
//         { firstName: { contains: filters.search, mode: "insensitive" } },
//         { lastName: { contains: filters.search, mode: "insensitive" } },
//         { fullName: { contains: filters.search, mode: "insensitive" } },
//       ],
//     }),
//   };

//   const [users, total] = await Promise.all([
//     prisma.user.findMany({
//       where,
//       skip: ((filters?.page || 1) - 1) * (filters?.limit || 10),
//       take: filters?.limit || 10,
//     }),
//     prisma.user.count({ where }),
//   ]);

//   return {
//     users,
//     total,
//     page: filters?.page || 1,
//     limit: filters?.limit || 10,
//   };
// };

export const createUser = async (data: createUserInput): Promise<User> => {
  const { firstName, lastName, ...rest } = data;
  return prisma.user.create({
    data: {
      ...rest,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      role: "USER",
    },
  });
};

// export const updateUser = async (id: string, data: any) => {
//   return prisma.user.update({
//     where: { id },
//     data,
//   });
// };

// export const deleteUser = async (id: string) => {
//   return prisma.user.delete({
//     where: { id },
//   });
// };
