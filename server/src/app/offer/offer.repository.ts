import { PrismaClient, OfferStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function create(data: {
  taskId: string;
  providerId: string;
  hourlyRate: number;
  currency: string;
}) {
  return prisma.offer.create({
    data: {
      ...data,
      status: OfferStatus.PENDING,
    },
  });
}

export async function findById(id: string) {
  return prisma.offer.findUnique({
    where: { id },
  });
}

export async function findByTaskId(taskId: string) {
  return prisma.offer.findMany({
    where: { taskId },
  });
}

export async function findByProviderId(providerId: string) {
  return prisma.offer.findMany({
    where: { providerId },
  });
}

export async function update(
  id: string,
  data: Partial<{
    hourlyRate: number;
    currency: string;
    status: OfferStatus;
    providerId: string;
  }>
) {
  return prisma.offer.update({
    where: { id },
    data,
  });
}

export async function deleteOffer(id: string) {
  return prisma.offer.delete({
    where: { id },
  });
}

export async function updateStatus(id: string, status: OfferStatus) {
  return prisma.offer.update({
    where: { id },
    data: { status },
  });
}

export async function acceptOffer(id: string) {
  return prisma.offer.update({
    where: { id },
    data: { status: OfferStatus.ACCEPTED },
  });
}

export async function rejectOffer(id: string) {
  return prisma.offer.update({
    where: { id },
    data: { status: OfferStatus.REJECTED },
  });
}

export async function findPendingOffersByTaskId(taskId: string) {
  return prisma.offer.findMany({
    where: { taskId, status: OfferStatus.PENDING },
  });
}

export async function findAcceptedOfferByTaskId(taskId: string) {
  return prisma.offer.findFirst({
    where: { taskId, status: OfferStatus.ACCEPTED },
  });
}
