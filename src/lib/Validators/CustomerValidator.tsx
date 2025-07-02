import { z } from "zod";

export const CustomerValidator = z.object({
  name: z
    .string()
    .min(1, { message: "Customer should atleast have one character" }),
  GST: z.string().optional(),
  email: z.string().email().optional(),
  country: z.string(),
  addressLine1: z.string().min(3, {
    message: "Address Line 1 is required",
  }),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export type CustomerCreationRequest = z.infer<typeof CustomerValidator>;
