import { z } from "zod";
import { ADDRESS_LABELS } from "./address.model";

export const addressInputSchema = z.object({
  label: z.enum(ADDRESS_LABELS).default("home"),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(80),
  phone: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit mobile number"),
  addressLine1: z.string().trim().min(5, "Address must be at least 5 characters").max(150),
  addressLine2: z.string().trim().max(150).default(""),
  city: z.string().trim().min(2, "City is required").max(60),
  state: z.string().trim().min(2, "State is required").max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressInputSchema>;