/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import cors from "cors";

import { PrismaClient } from "@prisma/client";
import defineProviderRoutes from "../app/provider/provider.routes";
import defineSkillRoutes from "../app/skill/skill.routes";
import defineTaskRoutes from "../app/task/task.routes";
import { signAccessToken } from "../app/user/user.helper";
import defineUserRoutes from "../app/user/user.routes";
import { AccessTokenPayload, authentication } from "../middleware/middleware";
import AppError from "../utils/exception";
import { generalLogger } from "../utils/logger";

const prisma = new PrismaClient();

export default async (expressApp: Application) => {
  expressApp.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  expressApp.use(express.urlencoded({ extended: true, limit: "50mb" }));
  expressApp.use(express.json({ limit: "50mb" }));

  expressApp.post("/api/v1/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body as unknown as {
      email: string;
      password: string;
    };

    // Try to find user first
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user not found, try to find provider
    const provider = !user
      ? await prisma.provider.findUnique({
          where: { email },
        })
      : null;

    // If neither user nor provider found
    if (!user && !provider) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password for either user or provider
    const entity = user || provider;
    if (entity?.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAccessToken({
      userId: entity.id,
      email: entity.email,
    });

    const response = {
      accessToken: token,
      user: {
        id: entity.id,
        email: entity.email,
        role: entity.role,
        firstName: entity.firstName,
        lastName: entity.lastName,
        fullName: entity.fullName,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        // Include provider-specific fields if it's a provider
        ...(entity.role === "PROVIDER" && {
          providerType: (entity as any).providerType,
          companyName: (entity as any).companyName,
          businessTaxNumber: (entity as any).businessTaxNumber,
        }),
      },
    };
    return res.status(200).json(response);
  });

  expressApp.get(
    "/api/v1/auth/me",
    authentication,
    (_req: Request, res: Response) => {
      const user = res.locals as AccessTokenPayload;
      console.log(user);
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };
      res.status(httpStatus.OK).send({ ...userData });
    }
  );

  defineUserRoutes(expressApp);
  defineTaskRoutes(expressApp);
  defineProviderRoutes(expressApp);
  defineSkillRoutes(expressApp);

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
