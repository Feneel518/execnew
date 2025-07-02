import { z } from "zod";

export const ChallanValidator = z.object({
  id: z.string().optional(),
  challanNumber: z.coerce.number(),
  poNumber: z.string().optional(),
  poDate: z.date().optional(),
  challanDate: z.date().optional(),
  customerId: z.string(),
  status: z.enum(["OPEN", "CLOSE"]).default("OPEN"),
  causeOfChallan: z
    .enum(["AS_PER_SAMPLE", "FOR_REPLACEMENT", "RETURNABLE"])
    .default("AS_PER_SAMPLE"),
  additionalNotes: z.string().optional(),
  ProductInChallan: z
    .object({
      id: z.string().optional(),
      index: z.number(),
      price: z.coerce.number(),
      quantity: z.coerce.number(),
      description: z.string().optional(),
      productId: z.string(),
    })
    .array(),
});

export type ChallanCreationRequest = z.infer<typeof ChallanValidator>;
