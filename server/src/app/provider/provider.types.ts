import { User } from "@prisma/client";
import { Request, Response } from "express";
import { ProviderInput } from "./provider.validator";

// Create task request and response types
export interface CreateProviderRequest extends Request {
  body: ProviderInput;
}

export type CreateProviderResponse = Response<unknown, { user: User }>;
