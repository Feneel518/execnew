import { z } from "zod";

export const addPropertySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(3, "Address is too short"),
  rent: z.coerce.number().min(1, "Rent must be at least ₹1"),
});

export type addPropertySchemaRequest = z.infer<typeof addPropertySchema>;

export const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  email: z.string().email().optional(),
  openingBalance: z.coerce.number().min(0, "Must be 0 or more"),
  propertyId: z.string(),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;
