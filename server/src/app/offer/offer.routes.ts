import express, { NextFunction, Response } from "express";
import httpStatus from "http-status";
import {
  AccessTokenPayload,
  authentication,
} from "../../middleware/middleware";
import * as offerService from "./offer.services";
import {
  CreateOfferRequest,
  CreateOfferResponse,
  GetOfferRequest,
  GetOfferResponse,
  GetOffersByProviderRequest,
  GetOffersByTaskRequest,
  ListOffersResponse,
} from "./offer.types";

export default function defineOfferRoutes(expressApp: express.Application) {
  const offerRouter = express.Router();

  // Create a new offer
  offerRouter.post(
    "/",
    authentication,
    async (
      request: CreateOfferRequest,
      response: Response<CreateOfferResponse>,
      next: NextFunction
    ) => {
      try {
        const { id } = response.locals as AccessTokenPayload;
        const offer = await offerService.createOffer(
          {
            ...request.body,
          },
          id
        );
        response.status(httpStatus.CREATED).send({
          success: true,
          data: offer,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Get offer by ID
  offerRouter.get(
    "/:id",
    authentication,
    async (
      request: GetOfferRequest,
      response: Response<GetOfferResponse>,
      next: NextFunction
    ) => {
      try {
        const id = request.params.id;

        const offer = await offerService.getOfferById(id);

        response.status(httpStatus.OK).send({
          success: true,
          data: offer,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Get offers by task ID
  offerRouter.get(
    "/task/:taskId",
    authentication,
    async (
      request: GetOffersByTaskRequest,
      response: Response,
      next: NextFunction
    ) => {
      try {
        const taskId = request.params.taskId;

        const offers = await offerService.getOffersByTaskId(taskId);
        response.status(httpStatus.OK).send(offers);
      } catch (error) {
        next(error);
      }
    }
  );

  // Get offers by provider ID
  offerRouter.get(
    "/provider/:providerId",
    authentication,
    async (
      request: GetOffersByProviderRequest,
      response: Response<ListOffersResponse>,
      next: NextFunction
    ) => {
      try {
        const providerId = request.params.providerId;

        const offers = await offerService.getOffersByProviderId(providerId);
        response.status(httpStatus.OK).send({
          success: true,
          data: {
            offers,
            total: offers.length,
            page: 1,
            limit: offers.length,
          },
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Accept offer
  offerRouter.post(
    "/:id/accept",
    authentication,
    async (
      request: GetOfferRequest,
      response: Response<GetOfferResponse>,
      next: NextFunction
    ) => {
      try {
        const { id: userId } = response.locals as AccessTokenPayload;
        const id = request.params.id;

        const offer = await offerService.acceptOffer(id, userId);

        response.status(httpStatus.OK).send({
          success: true,
          data: offer,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // Reject offer
  offerRouter.post(
    "/:id/reject",
    authentication,
    async (
      request: GetOfferRequest,
      response: Response<GetOfferResponse>,
      next: NextFunction
    ) => {
      try {
        const { id: userId } = response.locals as AccessTokenPayload;
        const id = request.params.id;

        const offer = await offerService.rejectOffer(id, userId);

        response.status(httpStatus.OK).send({
          success: true,
          data: offer,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use("/api/v1/offers", offerRouter);
}
