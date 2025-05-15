import { z } from "zod";

// Offer validation schema for create and update
export const offerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  duration: z.number().positive("Duration must be a positive number"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement must be specified"),
  isActive: z.boolean().optional(),
});

// Type for the validated offer data
export type OfferInput = z.infer<typeof offerSchema>;

export const offerIdSchema = z.object({
  id: z.string().uuid("Invalid offer ID"),
});
