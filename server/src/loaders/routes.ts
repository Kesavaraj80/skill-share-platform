import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import cors from "cors";

import AppError from "../utils/exception";
import { generalLogger } from "../utils/logger";
import defineUserRoutes from "../app/user/user.routes";

export default async (expressApp: Application) => {
  expressApp.use(cors());

  expressApp.use(express.urlencoded({ extended: true, limit: "50mb" }));
  expressApp.use(express.json({ limit: "50mb" }));

  defineUserRoutes(expressApp);

  expressApp.use("/static", express.static("public"));

  expressApp.use(
    (request: Request, _response: Response, next: NextFunction) => {
      try {
        throw new Error(
          `Request URL (${request.originalUrl}) is not available`
        );
      } catch (error) {
        next(error);
      }
    }
  );

  handleErrorRoute(expressApp);
};

const handleErrorRoute = (expressApp: express.Application) => {
  expressApp.use(
    async (
      error: any,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      generalLogger.error(
        error.message ? error.message : "SOMETHING WENT WRONG"
      );
      response
        .status(error instanceof AppError ? error.HTTPStatus : 500)
        .send(
          error instanceof AppError
            ? {
                success: false,
                error: true,
                errorType: error.type,
                statusCode: error.HTTPStatus,
                message: error.message,
              }
            : {
                success: false,
                error: true,
                errorType: "UNKNOWN_ERROR",
                message: error.message ? error.message : "UNKNOWN_ERROR",
                statusCode: httpStatus.INTERNAL_SERVER_ERROR,
              }
        )
        .end();
    }
  );
};
