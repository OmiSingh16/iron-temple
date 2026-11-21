import { z } from "zod";

export const memberSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  age: z.coerce.number().min(10, "Age must be at least 10").max(100).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});
