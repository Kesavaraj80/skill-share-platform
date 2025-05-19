import { Skill } from "@prisma/client";
import { Request, Response } from "express";
import { SkillInput } from "./skill.validator";

// Base response interface
interface BaseResponse extends Response {
  success: boolean;
  message?: string;
  error?: string;
}

// Create skill request and response types
export interface CreateSkillRequest extends Request {
  body: SkillInput;
}

export type CreateSkillResponse = Response<unknown>;
// List skills response type
export interface ListSkillsResponse extends BaseResponse {
  data?: {
    skills: Skill[];
  };
}

// Update skill request and response types
export interface UpdateSkillRequest extends Request {
  params: {
    id: string;
  };
  body: SkillInput;
}

export type UpdateSkillResponse = Response<unknown>;
