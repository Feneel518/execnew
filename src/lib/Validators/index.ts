import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(1, { message: "Password is required." }),
  code: z.optional(z.string()),
});

export type LoginSchemaRequest = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().min(6, { message: "Minimum 6 characters required." }),
  name: z.string().min(1, { message: "Name is required." }),
});

export type RegisterSchemaRequest = z.infer<typeof RegisterSchema>;

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
});

export type ResetSchemaRequest = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters required." }),
});

export type NewPasswordSchemaRequest = z.infer<typeof NewPasswordSchema>;

export const SettingsSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
});

export type SettingsSchemaRequest = z.infer<typeof SettingsSchema>;
