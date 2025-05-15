import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as providerService from "./provider.services";

export default function defineProviderRoutes(expressApp: express.Application) {
  const providerRouter = express.Router();

  // Create a new provider
  providerRouter.post(
    "/",
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const provider = await providerService.createProvider(request.body);
        response.status(httpStatus.CREATED).send(provider);
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use("/api/v1/providers", providerRouter);
}
