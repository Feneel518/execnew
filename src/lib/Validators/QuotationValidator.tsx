import { z } from "zod";

export const QuotationValidator = z.object({
  id: z.string().optional(),
  quotationNumber: z.number(),
  additionalNotes: z.string().optional(),
  gst: z.enum([
    "IGST_18",
    "CGST_SGST_18",
    "IGST_5",
    "CGST_SGST_5",
    "IGST_12",
    "CGST_SGST_12",
    "IGST_28",
    "CGST_SGST_28",
    "IGST_0_1",
    "CGST_SGST_0_1",
  ]),
  packingCharges: z.enum(["INCLUDED", "EXCLUDED"]),
  paymentTerms: z.enum([
    "ADVANCE",
    "AGAINST_PERFOMA_INVOICE",
    "AGAINST_DELIVERY",
    "CREDIT_30",
    "CREDIT_45",
    "CREDIT_60",
  ]),
  transportationPayment: z.enum(["PAID", "TO_PAY"]),
  deliveryDate: z.date(),
  discount: z.string().optional(),
  clientName: z.string().optional(),
  deliverDateNew: z.string().optional(),
  items: z
    .object({
      id: z.string().optional(),
      productId: z.string(),
      index: z.number(),
      rating: z.string().optional(),
      terminals: z.string().optional(),
      hardware: z.string().optional(),
      gasket: z.string().optional(),
      mounting: z.string().optional(),
      cableEntry: z.string().optional(),
      earting: z.string().optional(),
      typeNumber: z.string().optional(),
      hsnCode: z.string().optional(),
      cutoutSize: z.string().optional(),
      plateSize: z.string().optional(),
      glass: z.string().optional(),
      wireGuard: z.string().optional(),
      variant: z.string().optional(),
      size: z.string().optional(),
      rpm: z.string().optional(),
      kW: z.string().optional(),
      HorsePower: z.string().optional(),
      poReferrence: z.string().optional(),
      quantity: z.string().optional(),
      price: z.string(),
      components: z
        .object({
          compId: z.string().optional(),
          items: z.string(),
        })
        .array()
        .optional(),
    })
    .array(),
  customerId: z.string(),
});

export type QuotationCreationRequest = z.infer<typeof QuotationValidator>;
