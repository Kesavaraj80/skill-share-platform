import { z } from "zod";

// Skill validation schema for create and update
export const skillSchema = z.object({
  category: z.string().min(2, "Category must be at least 2 characters"),
  experience: z.string(),
  workNature: z.string().min(2, "Work nature must be at least 2 characters"),
  hourlyRate: z.string().min(0, "Hourly rate must be at least 0"),
  currency: z.string().min(2, "Currency must be at least 2 characters"),
});

// Type for the validated skill data
export type SkillInput = z.infer<typeof skillSchema>;
