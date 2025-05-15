import { z } from "zod";
import { validateRequestBody } from "../../utils/validators/requestValidators";

// Task validation schema for create and update
export const taskSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  expectedStartDate: z.string(),
  expectedHours: z.string(),
  hourlyRate: z.string(),
  currency: z.string().length(3, "Currency must be a 3-letter code"),
});

// Update task validation schema
export const updateTaskSchema = taskSchema;

// Type for the validated task data
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const validateTaskCreate = validateRequestBody(taskSchema);
export const validateTaskUpdate = validateRequestBody(updateTaskSchema);
