/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import cors from "cors";

import defineUserRoutes from "../app/user/user.routes";
import AppError from "../utils/exception";
import { generalLogger } from "../utils/logger";
import { PrismaClient, User } from "@prisma/client";
import { signAccessToken } from "../app/user/user.helper";
import { authentication } from "../middleware/middleware";
import defineTaskRoutes from "../app/task/task.routes";
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
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const response = {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
    return res.status(200).json(response);
  });

  expressApp.get(
    "/api/v1/auth/me",
    authentication,
    (_req: Request, res: Response) => {
      const user = res.locals as User;
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
