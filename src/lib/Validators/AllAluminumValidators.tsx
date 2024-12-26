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

export const AluminumTransactionValidator = z.object({
  id: z.string().optional(),
  status: z.enum(["IN", "OUT"]),
  inwardType: z
    .enum(["ALUMINUM", "CASTING", "LOSSES", "REPLACE_ALUMINUM", "RETURNABLE"])
    .optional(),
  aluminumType: z.enum(["SCRAP", "GRAVITY", "PRESSURE", "LADI"]).optional(),
  supplierId: z.string(),
  docketNumber: z.string(),
  docketDate: z.date().optional(),
  weight: z.coerce.number(),
  quantity: z.coerce.number().optional(),
  quantityType: z.string().optional(),
  price: z.coerce.number().optional(),
  userId: z.string().optional(),
  TransactionCalculation: z
    .object({
      id: z.string().optional(),
      index: z.coerce.number(),
      weight: z.coerce.number(),
      quantity: z.coerce.number().optional(),
      quantityType: z.string().optional(),
    })
    .array()
    .optional(),
});

export type AluminumTransactionCreationRequest = z.infer<
  typeof AluminumTransactionValidator
>;

export const CastingProdcutsValidator = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  weight: z.coerce.number(),
  name: z
    .string()
    .min(1, { message: "Product should atleast have one character" }),
});

export type CastingProdcutsCreationRequest = z.infer<
  typeof CastingProdcutsValidator
>;
