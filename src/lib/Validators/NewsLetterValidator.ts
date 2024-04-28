import z from "zod";

export const newsLetterValidator = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Name is required" }),
  companyName: z.string().min(1, { message: "Name is required" }),
});

export type newsLetterRequest = z.infer<typeof newsLetterValidator>;
