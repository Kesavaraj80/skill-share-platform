import { z } from "zod";
import { validateRequestBody } from "../../utils/validators/requestValidators";

// Common fields for both User and Provider
const commonFields = {
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  mobileNumber: z.string().max(10, "Mobile number must be at least 10 digits"),
  streetNumber: z.string(),
  streetName: z.string(),
  city: z.string(),
  state: z.string(),
  postCode: z.string(),
};

// Provider validation schema
export const providerSchema = z.object({
  ...commonFields,
  role: z.literal("PROVIDER"),
  providerType: z.enum(["INDIVIDUAL", "COMPANY"]),
  companyName: z.string().optional(),
  businessTaxNumber: z.string().optional(),
});

// Types for the validated data
export type ProviderInput = z.infer<typeof providerSchema>;

export const validateProviderCreate = validateRequestBody(providerSchema);
