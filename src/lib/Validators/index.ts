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

export const ContactValidator = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({
    message: "Email is required.",
  }),
  companyName: z.string().min(1, { message: "Company Name is required." }),
  message: z.string().min(1, { message: "Name is required." }),
  terms: z.boolean(),
});
export type ContactSchemeRequest = z.infer<typeof ContactValidator>;

export const StoreProductValidator = z.object({
  name: z
    .string()
    .min(1, { message: "Product should atleast have one character" }),
  image: z.string(),
  description: z.string().optional(),
  qrCodeLink: z.string(),
  storeProductId: z.string(),
});

export type StoreProductSchemeRequest = z.infer<typeof StoreProductValidator>;

export const InventoryValidator = z.object({
  storeProductId: z.string(),
  employeeId: z.string().optional(),
  status: z.string(),
  quantity: z.string(),
});

export type InventorySchemaRequest = z.infer<typeof InventoryValidator>;

export const EmployeeValidator = z.object({
  name: z
    .string()
    .min(1, { message: "Product should atleast have one character" }),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  aadhharNumber: z.string().optional(),
});
export type EmployeeSchemeRequest = z.infer<typeof EmployeeValidator>;

export const TestCertificatevalidator = z.object({
  items: z.array(
    z.object({
      name: z
        .string()
        .min(3, { message: "Required" })
        .min(3, { message: "Required" }),
      type: z.string().min(3, { message: "Required" }),
      protection: z.string().min(3, { message: "Required" }),
      gasGroup: z.string().min(3, { message: "Required" }),
      typeNumber: z.string().min(3, { message: "Required" }),
      certificateNumber: z.string().min(3, { message: "Required" }),
      invoice: z.array(
        z.object({
          invoiceNumber: z.string().min(3, { message: "Required" }),
          invoiceDate: z.date(),
        })
      ),
      quantity: z.coerce.number().positive(),
      id: z.string().min(3, { message: "Required" }),
    })
  ),
});

export type TestCertificateSchemaRequest = z.infer<
  typeof TestCertificatevalidator
>;

export const InvoiceCreationSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string().min(3, { message: "Invoice number is required" }),
  invoiceDate: z.date(),
  transportName: z.string().optional(),
  LrNumber: z.string().optional(),
  LrUrl: z.string().optional(),
  orderId: z.string().optional(),
  items: z.array(
    z
      .object({
        id: z.string().optional(),
        orderProductName: z.string(),
        orderProductDescription: z.string().optional(),
        orderProductQuantity: z.coerce.number(),
        suppliedQuantity: z.coerce.number(),
        certificateNumber: z.string().optional(),
        typeNumber: z.string().optional(),
        orderProductInOrderId: z.string(),
        numberOfBoxes: z.coerce.number().optional(),
        pendingQuantity: z.coerce.number(),
      })
      .refine((data) => data.suppliedQuantity <= data.pendingQuantity, {
        path: ["suppliedQuantity"],
        message: "Supplied quantity cannot be larger than pending quantity",
      })
  ),
});

export type InvoiceCreationSchemaRequest = z.infer<
  typeof InvoiceCreationSchema
>;
export const PerfomaInvoiceCreationSchema = z.object({
  id: z.string().optional(),
  perfomaInvoiceNumber: z.coerce.number(),
  perfomaInvoiceDate: z.date(),
  additionalNotes: z.string().optional(),
  shippingCharges: z.coerce.number().optional(),
  paymentStatus: z
    .enum(["PENDING", "RECEIVED", "CANCELLED"])
    .default("PENDING"),
  orderId: z.string().optional(),
  ProductInPerfomaInvoiceOfOrder: z.array(
    z
      .object({
        id: z.string().optional(),
        orderProductName: z.string(),
        orderProductDescription: z.string().optional(),
        suppliedQuantity: z.coerce.number(),
        orderProductInOrderId: z.string(),
        pendingQuantity: z.coerce.number(),
      })
      .refine((data) => data.suppliedQuantity <= data.pendingQuantity, {
        path: ["suppliedQuantity"],
        message: "Supplied quantity cannot be larger than pending quantity",
      })
  ),
});

export type PerfomaInvoiceCreationSchemaRequest = z.infer<
  typeof PerfomaInvoiceCreationSchema
>;

export const TaskValidator = z.object({
  id: z.string().optional(),
  task: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("LOW"),
  dueDate: z.date().optional(),
});

export type TaskCreationRequest = z.infer<typeof TaskValidator>;
