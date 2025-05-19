import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import {
  AccessTokenPayload,
  authentication,
} from "../../middleware/middleware";
import * as skillService from "./skill.services";
import {
  CreateSkillRequest,
  CreateSkillResponse,
  UpdateSkillRequest,
  UpdateSkillResponse,
} from "./skill.types";

export default function defineSkillRoutes(expressApp: express.Application) {
  const skillRouter = express.Router();

  skillRouter.post(
    "/",
    authentication,
    async (
      request: CreateSkillRequest,
      response: CreateSkillResponse,
      next: NextFunction
    ) => {
      try {
        const { id } = response.locals as AccessTokenPayload;
        const skill = await skillService.createSkill(request.body, id);
        response.status(httpStatus.CREATED).send(skill);
      } catch (error) {
        next(error);
      }
    }
  );

  // Get skills by provider ID
  skillRouter.get(
    "/provider/:providerId",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const providerId = request.params["providerId"];
        const skills = await skillService.getSkillsByProviderId(providerId);
        response.status(httpStatus.OK).send({ data: skills });
      } catch (error) {
        next(error);
      }
    }
  );

  // Update skill
  skillRouter.put(
    "/:id",
    authentication,
    async (
      request: UpdateSkillRequest,
      response: UpdateSkillResponse,
      next: NextFunction
    ) => {
      try {
        const { user } = response.locals;
        const id = request.params["id"];
        const skill = await skillService.updateSkill(
          id,
          request.body,
          user._id.toString()
        );
        response.status(httpStatus.OK).send(skill);
      } catch (error) {
        next(error);
      }
    }
  );

  // Delete skill
  skillRouter.delete(
    "/:id",
    authentication,
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { user } = response.locals;
        const id = request.params["id"];
        await skillService.deleteSkill(id, user._id.toString());
        response
          .status(httpStatus.OK)
          .send({ message: "Skill deleted successfully" });
      } catch (error) {
        next(error);
      }
    }
  );

  expressApp.use("/api/v1/skills", skillRouter);
}
