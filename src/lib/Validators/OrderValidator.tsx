import { z } from "zod";

export const OrderValidator = z.object({
  id: z.string().optional(),
  orderNumber: z.coerce.number(),
  poNumber: z.string().optional(),
  poDate: z.date().optional(),
  customerId: z.string(),
  status: z
    .enum(["COMPLETED", "PENDING", "PARTIAL_COMPLETED"])
    .default("PENDING"),
  notes: z.string().optional(),
  quotationNumber: z.string().optional(),
  orderPDFFile: z.string().optional(),
  uniqueQuotationNumber: z.string().optional(),
  ProductInOrder: z
    .object({
      id: z.string().optional(),
      index: z.number(),
      price: z.coerce.number(),
      quantity: z.coerce
        .number()
        .min(1, { message: "Quantity should be greater than 0" }),
      description: z.string().optional(),
      certificateNumber: z.string().optional(),
      supplied: z.coerce.number(),
      productId: z.string(),
      supply: z
        .object({
          supplyQuantity: z.coerce.number().optional(),
          invoiceNumber: z.string().optional(),
          invoiceDate: z.date().optional(),
        })
        .array()
        .optional(),
    })
    .array(),
});

export type OrderCreationRequest = z.infer<typeof OrderValidator>;
