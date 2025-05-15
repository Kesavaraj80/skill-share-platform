import { z } from "zod";

// Skill validation schema for create and update
export const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
});

// Type for the validated skill data
export type SkillInput = z.infer<typeof skillSchema>;

// Schema for skill ID parameter validation
export const skillIdSchema = z.object({
  id: z.string().uuid("Invalid skill ID"),
});

// Schema for skill listing query parameters
export const skillListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1")),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10")),
  category: z.string().optional(),
  search: z.string().optional(),
});
