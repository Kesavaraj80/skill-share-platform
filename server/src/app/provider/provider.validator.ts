import { z } from "zod";

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
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 digits")
    .regex(/^[0-9+]+$/, "Mobile number must contain only digits and + symbol"),
  streetNumber: z.string(),
  streetName: z.string(),
  city: z.string(),
  state: z.string(),
  postCode: z.string(),
};

// Provider validation schema
export const providerSchema = z
  .object({
    ...commonFields,
    role: z.literal("PROVIDER"),
    providerType: z.enum(["INDIVIDUAL", "COMPANY"]),
    companyName: z.string().optional(),
    businessTaxNumber: z
      .string()
      .regex(
        /^[A-Z0-9]{10}$/,
        "Business Tax Number must be 10 characters long and contain only capital letters and numbers"
      )
      .optional(),
    skills: z
      .array(z.string())
      .min(1, "At least one skill must be specified")
      .optional(),
    experience: z
      .number()
      .min(0, "Experience must be a non-negative number")
      .optional(),
    education: z
      .string()
      .min(2, "Education must be at least 2 characters")
      .optional(),
    certifications: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.providerType === "INDIVIDUAL") {
        return data.firstName && data.lastName && data.fullName;
      } else if (data.providerType === "COMPANY") {
        return data.companyName && data.businessTaxNumber;
      }
      return true;
    },
    {
      message: "Provider type specific fields are required",
    }
  );

// Types for the validated data
export type ProviderInput = z.infer<typeof providerSchema>;
