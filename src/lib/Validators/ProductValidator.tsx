import { z } from "zod";

export const ProductValidator = z.object({
  name: z
    .string()
    .min(1, { message: "Product should atleast have one character" }),
  image: z.string(),
  type: z.string().optional(),
  protection: z.string().optional(),
  gasGroup: z.string().optional(),
  material: z.string().optional(),
  finish: z.string().optional(),
  rating: z.string().optional(),
  components: z
    .object({
      items: z.string(),
    })
    .array()
    .optional(),
  terminals: z.string().optional(),
  hardware: z.string(),
  gasket: z.string().optional(),
  mounting: z.string().optional(),
  cableEntry: z.string(),
  earting: z.string(),
  typeNumber: z.string().optional(),
  hsnCode: z.string(),
  cutoutSize: z.string().optional(),
  plateSize: z.string().optional(),
  glass: z.string().optional(),
  wireGuard: z.string().optional(),
  variant: z.string().optional(),
  size: z.string().optional(),
  rpm: z.string().optional(),
  kW: z.string().optional(),
  HorsePower: z.string().optional(),
  categoryId: z.string().optional(),
});

export type ProductCreationRequest = z.infer<typeof ProductValidator>;
