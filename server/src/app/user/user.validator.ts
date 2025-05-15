import { z } from "zod";
import { validateRequestBody } from "../../utils/validators/requestValidators";

// Common fields for both User and Provider
const commonFields = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  streetNumber: z.string(),
  streetName: z.string(),
  city: z.string(),
  state: z.string(),
  postCode: z.string(),
};

// User validation schema
export const userSchema = z.object({
  ...commonFields,
});

// Types for the validated data
export type UserInput = z.infer<typeof userSchema>;

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type createUserInput = z.infer<typeof userSchema>;
export const validateCreateUser = validateRequestBody(userSchema);
