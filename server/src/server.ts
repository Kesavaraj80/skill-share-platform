import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";

import { PrismaClient } from "@prisma/client";
import config from "./config";
import defineAPIRoutes from "./loaders/routes";

import { HandleError } from "./utils/exception";
import { generalLogger } from "./utils/logger";

const prisma = new PrismaClient();
let connection: Server;

export default async function startApplicationServer(): Promise<AddressInfo> {
  const expressApp = express();

  // Routes
  defineAPIRoutes(expressApp);

  const APIAddress = await setupConnections(expressApp);
  return APIAddress;
}

const setupConnections = async (
  expressApp: express.Application
): Promise<AddressInfo> => {
  return new Promise((resolve, reject) => {
    connection = expressApp.listen(config.PORT, async () => {
      try {
        // Test database connection
        await prisma.$connect();
        generalLogger.info("Database connected successfully");

        resolve(connection.address() as AddressInfo);
      } catch (error) {
        reject(HandleError(error));
      }
    });
  });
};
