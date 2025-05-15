import { Request, Response } from "express";
import { createUserInput } from "./user.validator";

// Create user request and response types
export interface CreateUserRequest extends Request {
  body: createUserInput;
}

export type CreateUserResponse = Response<unknown>;
