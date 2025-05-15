import express, { NextFunction } from "express";
import httpStatus from "http-status";
import * as providerService from "./provider.services";
import {
  CreateProviderRequest,
  CreateProviderResponse,
} from "./provider.types";
import { validateProviderCreate } from "./provider.validator";

export default function defineProviderRoutes(expressApp: express.Application) {
  const providerRouter = express.Router();

  // Create a new provider
  providerRouter.post(
    "/",
    validateProviderCreate,
    async (
      request: CreateProviderRequest,
      response: CreateProviderResponse,
      next: NextFunction
    ) => {
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
