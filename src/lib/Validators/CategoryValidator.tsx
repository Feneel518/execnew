import { z } from "zod";

export const CategoryValidator = z.object({
  name: z
    .string()
    .min(1, { message: "Product should atleast have one character" }),
  image: z.string(),
  description: z.string().optional(),
});

export type CategoryCreationRequest = z.infer<typeof CategoryValidator>;
