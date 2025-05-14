import express from "express";

import { AddressInfo } from "net";
import { Server } from "http";

import config from "./config";

import mongoDBConnect from "./loaders/mongoose";
import defineAPIRoutes from "./loaders/routes";

import { generalLogger } from "./utils/logger";
import { HandleError } from "./utils/exception";
import User, { IUser } from "./app/user/user.model";

let connection: Server;

export default async function startApplicationServer(): Promise<AddressInfo> {
  const expressApp = express();

  defineAPIRoutes(expressApp);

  const APIAddress = await setupConnections(expressApp);
  return APIAddress;
}

const users: IUser[] = [
  {
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    mobile: "123-456-7890",
    password: "password123",
    wallet: 1500,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    mobile: "234-567-8901",
    password: "password456",
    wallet: 2000,
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    mobile: "345-678-9012",
    password: "password789",
    wallet: 1200,
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    fullName: "Emily Davis",
    email: "emily.davis@example.com",
    mobile: "456-789-0123",
    password: "password321",
    wallet: 1800,
  },
  {
    firstName: "William",
    lastName: "Brown",
    fullName: "William Brown",
    email: "william.brown@example.com",
    mobile: "567-890-1234",
    password: "password654",
    wallet: 2500,
  },
];

const setupConnections = async (
  expressApp: express.Application
): Promise<AddressInfo> => {
  return new Promise((resolve, reject) => {
    connection = expressApp.listen(config.PORT, async () => {
      try {
        await mongoDBConnect();
        generalLogger.info("Mongodb connected");
        const userData = await User.find();

        if (userData.length === 0) {
          await User.bulkWrite(
            users.map((user) => ({
              insertOne: {
                document: user,
              },
            }))
          );
        }
        resolve(connection.address() as AddressInfo);
      } catch (error) {
        reject(HandleError(error));
      }
    });
  });
};
