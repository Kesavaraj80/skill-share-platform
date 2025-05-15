import { Skill } from "@prisma/client";
import { Request } from "express";
import { SkillInput } from "./skill.validator";

// Base response interface
interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Create skill request and response types
export interface CreateSkillRequest extends Request {
  body: {
    name: string;
    description: string;
    category: string;
  };
}

export interface CreateSkillResponse extends BaseResponse {
  data?: Skill;
}

// Get skill request and response types
export interface GetSkillRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetSkillResponse extends BaseResponse {
  data?: Skill;
}

// List skills response type
export interface ListSkillsResponse extends BaseResponse {
  data?: {
    skills: Skill[];
    total: number;
    page: number;
    limit: number;
  };
}

// Update skill request and response types
export interface UpdateSkillRequest extends Request {
  params: {
    id: string;
  };
  body: Partial<SkillInput>;
}

export interface UpdateSkillResponse extends BaseResponse {
  data?: Skill;
}

// Delete skill request and response types
export interface DeleteSkillRequest extends Request {
  params: {
    id: string;
  };
}

export interface DeleteSkillResponse extends BaseResponse {
  data?: Skill;
}
