import { z } from "zod";

export const AluminumClientValidator = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Client should atleast have one character" }),
  GST: z.string().optional(),
  slug: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  type: z.enum(["USER", "SUPPLIER", "BOTH"]).default("USER"),
});

export type AluminumClientCreationRequest = z.infer<
  typeof AluminumClientValidator
>;
