"use server";
import { auth, signIn } from "@/auth";
import { getPasswordResetTokenByToken } from "@/data/passwordToken";
import { getTwoFactorConfirmationByUserid } from "@/data/twoFactorConfirmation";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import {
  ALUMINUMTYPE,
  Category,
  Customer,
  Employee,
  Inventory,
  Product,
  StoreProduct,
  TRANSACTIONSTATUS,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { db } from "./db";

import ObjectID from "bson-objectid";
import {
  generatePasswordResetToken,
  generateVerificationToken,
  generatetwoFactorToken,
} from "./tokens";
import { areQuantitiesEqual } from "./utils";
import {
  InvoiceCreationSchemaRequest,
  LoginSchema,
  LoginSchemaRequest,
  NewPasswordSchema,
  NewPasswordSchemaRequest,
  PerfomaInvoiceCreationSchemaRequest,
  RegisterSchema,
  RegisterSchemaRequest,
  ResetSchema,
  ResetSchemaRequest,
  TaskCreationRequest,
} from "./Validators";
import { ChallanCreationRequest } from "./Validators/ChallanValidator";
import { OrderCreationRequest } from "./Validators/OrderValidator";
import { QuotationCreationRequest } from "./Validators/QuotationValidator";
import {
  AluminumClientCreationRequest,
  AluminumTransactionCreationRequest,
  CastingProdcutsCreationRequest,
} from "./Validators/AllAluminumValidators";
import { AluminumStockUpdate } from "./aluminumQueries";

export const login = async (values: LoginSchemaRequest) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist." };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token
    // );
    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserid(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generatetwoFactorToken(existingUser.email);

      // await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const register = async (values: RegisterSchemaRequest) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use." };
  }

  const response = await db.user.create({
    data: {
      email,
      name,
      password: hashPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  // await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent" };
};

export const newPassword = async (
  values: NewPasswordSchemaRequest,
  token?: string | null
) => {
  if (!token) return { error: "Missing token!" };
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password updated." };
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified!" };
};

export const reset = async (values: ResetSchemaRequest) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordresetTokken = await generatePasswordResetToken(email);

  // await sendPasswordResetEmail(
  //   passwordresetTokken.email,
  //   passwordresetTokken.token
  // );

  return { success: "Reset email sent!" };
};

// //////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////

export const upsertProduct = async (
  product: Partial<
    Product & {
      components: {
        items: string;
      }[];
    }
  >
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.product.upsert({
    where: {
      id: product.id,
    },
    update: {
      cableEntry: product.cableEntry ?? "",
      cutoutSize: product.cutoutSize ?? "",
      earting: product.earting ?? "",
      finish: product.finish ?? "",
      gasGroup: product.gasGroup ?? "",
      gasket: product.gasket ?? "",
      glass: product.glass ?? "",
      hardware: product.hardware ?? "",
      HorsePower: product.HorsePower ?? "",
      hsnCode: product.hsnCode ?? "",
      image: product.image ?? "",
      kW: product.kW ?? "",
      material: product.material ?? "",
      mounting: product.mounting ?? "",
      name: product.name ?? "",
      slug: product.name
        ? encodeURI(product.name?.toLowerCase().replace(/\//g, "-"))
        : "",
      plateSize: product.plateSize ?? "",
      protection: product.protection ?? "",
      rating: product.rating ?? "",
      rpm: product.rpm ?? "",
      size: product.size ?? "",
      terminals: product.terminals ?? "",
      type: product.type ?? "",
      typeNumber: product.typeNumber ?? "",
      variant: product.variant ?? "",
      wireGuard: product.wireGuard ?? "",
      categoryId: product.categoryId ?? "",
      ProductComponentsOnProducts: {
        deleteMany: {
          productId: product.id,
        },
        create: product.components?.map((comp) => {
          return {
            productComponents: {
              create: {
                item: comp.items,
              },
            },
          };
        }),
      },
    },
    create: {
      cableEntry: product.cableEntry ?? "",
      cutoutSize: product.cutoutSize ?? "",
      earting: product.earting ?? "",
      finish: product.finish ?? "",
      gasGroup: product.gasGroup ?? "",
      gasket: product.gasket ?? "",
      glass: product.glass ?? "",
      hardware: product.hardware ?? "",
      HorsePower: product.HorsePower ?? "",
      hsnCode: product.hsnCode ?? "",
      image: product.image ?? "",
      kW: product.kW ?? "",
      material: product.material ?? "",
      mounting: product.mounting ?? "",
      name: product.name ?? "",
      slug: product.name
        ? encodeURI(product.name?.toLowerCase().replace(/\//g, "-"))
        : "",
      categoryId: product.categoryId ?? "",
      plateSize: product.plateSize ?? "",
      protection: product.protection ?? "",
      rating: product.rating ?? "",
      rpm: product.rpm ?? "",
      size: product.size ?? "",
      terminals: product.terminals ?? "",
      type: product.type ?? "",
      typeNumber: product.typeNumber ?? "",
      variant: product.variant ?? "",
      wireGuard: product.wireGuard ?? "",
      ProductComponentsOnProducts: {
        create: product.components?.map((comp) => {
          return {
            productComponents: {
              create: {
                item: comp.items,
              },
            },
          };
        }),
      },
    },
  });

  revalidatePath("/catalog");

  if (!response)
    return { error: "Could not create product, please try again later!" };
  if (response) return { success: response };
};

export const upsertCategory = async (
  category: Partial<
    Category & {
      productId: string;
    }
  >
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  try {
    const response = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: {
        image: category.image as string,
        name: category.name as string,
        slug: category.slug as string,
        description: category.description as string,
      },

      create: {
        image: category.image as string,
        name: category.name as string,
        slug: category.slug as string,
        description: category.description as string,
      },
    });
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    return new Response("Something went wrong.");
  }
};

export const getCategoryDetailsBasedOnSlug = async (slug: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;
  try {
    const response = await db.category.findUnique({
      where: {
        slug,
      },
    });
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    return new Response("Something went wrong.");
  }
};

export const getProductDetailsBasedOnSlug = async (slug: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.product.findUnique({
    where: {
      slug,
    },
    include: {
      ProductComponentsOnProducts: {
        select: {
          productComponents: {
            select: {
              item: true,
            },
          },
        },
      },
    },
  });
  if (!response)
    return { error: "Could not find product, please try again later!" };
  if (response) return { success: response };
};

export const deleteCategory = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  try {
    const productsWithCategory = await db.product.findMany({
      where: {
        categoryId: id,
      },
    });

    const response = await db.category.delete({
      where: {
        id,
      },
    });
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    return new Response("Something went wrong.");
  }
};

export const deleteProduct = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const ProductComponentsOnProductsDeletion =
    await db.productComponentsOnProducts.deleteMany({
      where: {
        productId: id,
      },
    });

  const ProductComponentsDeletion = await db.productComponents.deleteMany({
    where: {
      ProductComponentsOnProducts: {
        some: {
          productId: id,
        },
      },
    },
  });

  const response = await db.product.delete({
    where: {
      id,
    },
  });
  if (!response)
    return { error: "Could not delete product, please try again later!" };
  if (response) return { success: response };
};

export const fetchCategoryForSelect = async () => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (!categories) return { error: "No Categories" };
  if (categories) return { success: categories };
};

export const upsertCustomer = async (customer: Partial<Customer>) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.customer.upsert({
    where: {
      id: customer.id,
    },
    update: {
      addressLine1: customer.addressLine1 ?? "",
      addressLine2: customer.addressLine2 ?? "",
      city: customer.city ?? "",
      country: customer.country ?? "",
      email: customer.email ?? "",
      GST: customer.GST ?? "",
      name: customer.name ?? "",
      phoneNumber: customer.phoneNumber ?? "",
      pincode: customer.pincode ?? "",
      slug: customer.slug ?? "",
      state: customer.state ?? "",
    },
    create: {
      addressLine1: customer.addressLine1 ?? "",
      addressLine2: customer.addressLine2 ?? "",
      city: customer.city ?? "",
      country: customer.country ?? "",
      email: customer.email ?? "",
      GST: customer.GST ?? "",
      name: customer.name ?? "",
      phoneNumber: customer.phoneNumber ?? "",
      pincode: customer.pincode ?? "",
      slug: customer.slug ?? "",
      state: customer.state ?? "",
    },
  });
  // const response = await db.customer.create({
  //   data: {
  //     addressLine1: customer.addressLine1 ?? "",
  //     addressLine2: customer.addressLine2 ?? "",
  //     city: customer.city ?? "",
  //     country: customer.country ?? "",
  //     email: customer.email ?? "",
  //     GST: customer.GST ?? "",
  //     name: customer.name ?? "",
  //     phoneNumber: customer.phoneNumber ?? "",
  //     pincode: customer.pincode ?? "",
  //     slug: customer.slug ?? "",
  //     state: customer.state ?? "",
  //   },
  // });

  if (!response)
    return { error: "Could not create customer, please try again later!" };
  if (response) return { success: response };
};

export const deleteCustomer = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const customer = await db.customer.findUnique({
    where: {
      id,
    },
    select: {
      Order: {
        select: {
          id: true,
        },
      },
    },
  });

  const disconnect = await db.customer.update({
    where: {
      id,
    },
    data: {
      Order: {
        disconnect: customer?.Order.map((ord) => ({ id: ord.id })),
      },
    },
  });

  const response = await db.customer.delete({
    where: {
      id,
    },
  });
  if (!response)
    return { error: "Could not delete customer, please try again later!" };
  if (response) return { success: response };
};

export const getCustomerDetailsBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.customer.findUnique({
    where: {
      id,
    },
  });
  if (!response) return { error: "No customer with this id found." };
  if (response) return { success: response };
};

export const fetchCustomersForSelect = async () => {
  const customers = await db.customer.findMany({
    select: {
      id: true,
      name: true,
      paymentTerms: true,
      transportationPayment: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!customers) return { error: "No Customers" };
  if (customers) return { success: customers };
};

export const fetchProductsForSelect = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!products) return { error: "No Products" };
  if (products) return { success: products };
};

export const fetchPreviousQuotationNumber = async () => {
  const quotationNumber = await db.quotation.findFirst({
    where: {
      archived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      quotationNumber: true,
    },
  });

  if (!quotationNumber) return { error: "No Quotation Number" };
  if (quotationNumber) return { success: quotationNumber };
};

export const upsertQuotation = async (quotation: QuotationCreationRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const existingQuotation = await db.quotation.findUnique({
    where: { id: quotation.id },
    include: {
      ProductInQuotation: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
          ComponentsOfProductInQuotation: {
            include: {
              componentsOfQuotation: true,
            },
          },
        },
      },
    },
  });

  const client = await db.customer.findUnique({
    where: {
      id: quotation.customerId,
    },
  });

  const terms =
    client?.paymentTerms === quotation.paymentTerms &&
    client.transportationPayment === quotation.transportationPayment;

  if (!terms) {
    await db.customer.update({
      where: {
        id: quotation.customerId,
      },
      data: {
        paymentTerms: quotation.paymentTerms,
        transportationPayment: quotation.transportationPayment,
      },
    });
  }

  if (existingQuotation) {
    const existingItemIds = existingQuotation?.ProductInQuotation.map(
      (item) => item.id
    );
    const existingComponentIds = existingQuotation?.ProductInQuotation.flatMap(
      (item) =>
        item.ComponentsOfProductInQuotation?.map(
          (component) => component.componentsOfQuotation.id
        )
    );

    const newProductIds = quotation.items?.map((prod) => prod?.id);
    const newComponentsIds = quotation.items?.flatMap((prod) =>
      // @ts-ignore
      prod?.components?.map((comp) => comp.compId)
    );
    const productsToDelete = existingItemIds?.filter(
      (id) => !newProductIds?.includes(id)
    );
    const componentsToDelete = existingComponentIds?.filter(
      (id) => !newComponentsIds?.includes(id)
    );

    await db.componentsOfProductInQuotation.deleteMany({
      where: { componentsOfQuotationId: { in: componentsToDelete } },
    });
    const response = await db.productInQuotation.deleteMany({
      where: { id: { in: productsToDelete } },
    });

    if (!response)
      return { error: "Could not create quotation, please try again later!" };
    if (response) return { success: { id: existingQuotation.id } };
  } else if (!existingQuotation) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    const currentYear = new Date().getFullYear();
    const archiveYear = currentYear - 1;

    const fyStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
    const fyEndYear = fyStartYear + 1;

    const start = String(fyStartYear).slice(-2);
    const end = String(fyEndYear).slice(-2);

    const response = await db.quotation.create({
      data: {
        gst: quotation.gst,
        quotationNumber: quotation.quotationNumber,
        additionalNotes: quotation.additionalNotes,
        clientName: quotation.clientName ?? "",
        customerId: quotation.customerId ?? "",
        deliveryDate: quotation.deliveryDate ?? new Date(),
        deliverDateNew: quotation.deliverDateNew ?? "",
        discount: quotation.discount,
        packingCharges: quotation.packingCharges,
        paymentTerms: quotation.paymentTerms,
        transportationPayment: quotation.transportationPayment,
        uniqueQuotationNumber: `${start.toString().slice(-2)}-${end
          .toString()
          .slice(-2)}/${quotation.quotationNumber}`,
        archived: false,
      },
    });

    if (!response)
      return { error: "Could not create quotation, please try again later!" };
    if (response) return { success: response };
  }

  // const response = await db.quotation.upsert({
  //   where: {
  //     id: quotation.id ?? ObjectID().toString(),
  //   },
  //   create: {
  //     gst: quotation.gst,
  //     quotationNumber: quotation.quotationNumber,
  //     additionalNotes: quotation.additionalNotes,
  //     clientName: quotation.clientName ?? "",
  //     customerId: quotation.customerId ?? "",
  //     deliveryDate: quotation.deliveryDate ?? new Date(),
  //     deliverDateNew: quotation.deliverDateNew ?? "",
  //     discount: quotation.discount,
  //     packingCharges: quotation.packingCharges,
  //     paymentTerms: quotation.paymentTerms,
  //     transportationPayment: quotation.transportationPayment,
  //     ProductInQuotation: {
  //       create: quotation.items.map((product) => {
  //         return {
  //           productId: product.productId,
  //           index: product?.index,
  //           cableEntry: product?.cableEntry,
  //           cutoutSize: product?.cutoutSize,
  //           earting: product?.earting,
  //           gasket: product?.gasket,
  //           glass: product?.glass,
  //           hardware: product?.hardware,
  //           HorsePower: product?.HorsePower,
  //           hsnCode: product?.hsnCode,
  //           kW: product?.kW,
  //           plateSize: product?.plateSize,
  //           mounting: product?.mounting,
  //           poReferrence: product?.poReferrence,
  //           rating: product?.rating,
  //           rpm: product?.rpm,
  //           size: product?.size,
  //           terminals: product?.terminals,
  //           typeNumber: product?.typeNumber,
  //           variant: product?.variant,
  //           wireGuard: product?.wireGuard,
  //           price: Number(product?.price) ?? 1,
  //           quantity: product?.quantity,
  //           ComponentsOfProductInQuotation: {
  //             create: product.components?.map((comp) => {
  //               return {
  //                 componentsOfQuotation: {
  //                   create: {
  //                     item: comp.items,
  //                   },
  //                 },
  //               };
  //             }),
  //           },
  //         };
  //       }),
  //     },
  //   },
  //   update: {
  //     gst: quotation.gst,
  //     quotationNumber: quotation.quotationNumber,
  //     additionalNotes: quotation.additionalNotes,
  //     clientName: quotation.clientName ?? "",
  //     customerId: quotation.customerId ?? "",
  //     deliveryDate: quotation.deliveryDate ?? new Date(),
  //     deliverDateNew: quotation.deliverDateNew ?? "",
  //     discount: quotation.discount,
  //     packingCharges: quotation.packingCharges,
  //     paymentTerms: quotation.paymentTerms,
  //     transportationPayment: quotation.transportationPayment,
  //     ProductInQuotation: {
  //       upsert: quotation.items.map((product) => {
  //         return {
  //           where: {
  //             id: product.id ?? ObjectID().toString(),
  //           },
  //           create: {
  //             productId: product.productId,
  //             index: product?.index,
  //             cableEntry: product?.cableEntry,
  //             cutoutSize: product?.cutoutSize,
  //             earting: product?.earting,
  //             gasket: product?.gasket,
  //             glass: product?.glass,
  //             hardware: product?.hardware,
  //             HorsePower: product?.HorsePower,
  //             hsnCode: product?.hsnCode,
  //             kW: product?.kW,
  //             plateSize: product?.plateSize,
  //             mounting: product?.mounting,
  //             poReferrence: product?.poReferrence,
  //             rating: product?.rating,
  //             rpm: product?.rpm,
  //             size: product?.size,
  //             terminals: product?.terminals,
  //             typeNumber: product?.typeNumber,
  //             variant: product?.variant,
  //             wireGuard: product?.wireGuard,
  //             price: Number(product?.price) ?? 1,
  //             quantity: product?.quantity,
  //             ComponentsOfProductInQuotation: {
  //               create: product.components?.map((comp) => {
  //                 return {
  //                   componentsOfQuotation: {
  //                     create: {
  //                       item: comp.items ?? "",
  //                     },
  //                   },
  //                 };
  //               }),
  //             },
  //           },
  //           update: {
  //             productId: product.productId,
  //             index: product?.index,
  //             cableEntry: product?.cableEntry,
  //             cutoutSize: product?.cutoutSize,
  //             earting: product?.earting,
  //             gasket: product?.gasket,
  //             glass: product?.glass,
  //             hardware: product?.hardware,
  //             HorsePower: product?.HorsePower,
  //             hsnCode: product?.hsnCode,
  //             kW: product?.kW,
  //             plateSize: product?.plateSize,
  //             mounting: product?.mounting,
  //             poReferrence: product?.poReferrence,
  //             rating: product?.rating,
  //             rpm: product?.rpm,
  //             size: product?.size,
  //             terminals: product?.terminals,
  //             typeNumber: product?.typeNumber,
  //             variant: product?.variant,
  //             wireGuard: product?.wireGuard,
  //             price: Number(product?.price) ?? 1,
  //             quantity: product?.quantity,
  //             ComponentsOfProductInQuotation: {
  //               upsert: product.components?.map((comp) => {
  //                 return {
  //                   where: {
  //                     componentsOfQuotationId:
  //                       comp.compId ?? ObjectID().toString(),
  //                   },
  //                   create: {
  //                     componentsOfQuotation: {
  //                       create: {
  //                         item: comp.items,
  //                       },
  //                     },
  //                   },
  //                   update: {
  //                     componentsOfQuotation: {
  //                       create: {
  //                         item: comp.items,
  //                       },
  //                     },
  //                   },
  //                 };
  //               }),
  //             },
  //           },
  //         };
  //       }),
  //     },
  //   },
  // });

  // if (!response)
  //   return { error: "Could not create quotation, please try again later!" };
  // if (response) return { success: response };
};

export const getQuotationBasedOnid = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.quotation.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,

      ProductInQuotation: {
        include: {
          ComponentsOfProductInQuotation: {
            include: {
              componentsOfQuotation: {
                select: {
                  item: true,
                },
              },
            },
          },
          product: {
            include: {
              ProductComponentsOnProducts: {
                include: {
                  productComponents: {
                    select: {
                      item: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!response)
    return { error: "Could not find quotation, please try again later!" };
  if (response) return { success: response };
};
export const getArchiveQuotationBasedOnid = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.archivedQuotation.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,

      ArchivedProductInQuotation: {
        include: {
          product: {
            include: {
              ProductComponentsOnProducts: {
                include: {
                  productComponents: {
                    select: {
                      item: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!response)
    return { error: "Could not find quotation, please try again later!" };
  if (response) return { success: response };
};

export const deleteQuotation = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  await db.componentsOfProductInQuotation.deleteMany({
    where: {
      productInQuotation: {
        quotationId: id,
      },
    },
  });
  await db.componentsOfQuotation.deleteMany({
    where: {
      ComponentsOfProductInQuotation: {
        some: {
          productInQuotation: {
            quotationId: id,
          },
        },
      },
    },
  });
  await db.productInQuotation.deleteMany({
    where: {
      quotationId: id,
    },
  });

  const response = await db.quotation.delete({
    where: {
      id: id,
    },
  });

  if (!response)
    return { error: "Could not delete quotation, please try again later!" };
  if (response) return { success: "Quotation has been deleted." };
};

export const fetchPreviousOrderNumber = async () => {
  const orderNumber = await db.order.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      orderNumber: true,
    },
  });

  if (!orderNumber) return { error: "No Order Number" };
  if (orderNumber) return { success: orderNumber };
};

export const fetchPreviousChallanNumber = async () => {
  const response = await db.deliveryChallan.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      challanNumber: true,
    },
  });

  if (!response) return { error: "No Order Number" };
  if (response) return { success: response };
};

export const fetchPreviousStoreProductId = async () => {
  const response = await db.storeProduct.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      StoreProductId: true,
    },
  });
  if (!response) return { error: "No order number" };
  if (response) return { success: response };
};

export const upsertOrder = async (order: OrderCreationRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  if (order.quotationNumber) {
    await db.quotation.update({
      where: {
        uniqueQuotationNumber: order.uniqueQuotationNumber,
      },
      data: {
        orderNumber: order.orderNumber,
      },
    });
  }

  const ordersItemsIfAny = await db.order.findUnique({
    where: {
      id: order.id,
    },
    include: {
      ProductInOrder: true,
      Invoice: {
        include: {
          ProductInInvoiceOfOrder: true,
        },
      },
    },
  });

  if (order.ProductInOrder.length === ordersItemsIfAny?.ProductInOrder.length) {
    if (ordersItemsIfAny) {
      const sortedArray1 = ordersItemsIfAny.ProductInOrder.map(
        (obj) => obj.productId
      ).sort();
      const sortedArray2 = order.ProductInOrder.map(
        (obj) => obj.productId
      ).sort();

      const isSame = sortedArray1.every(
        (value, index) => value === sortedArray2[index]
      );

      if (isSame) {
        const response = await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            orderNumber: order.orderNumber!,
            customerId: order.customerId as string,
            notes: order.notes,
            poDate: order.poDate,
            poNumber: order.poNumber,
            quotationNumber: order.quotationNumber,
            status: order.status,
            orderPDFFile: order.orderPDFFile,
            ProductInOrder: {
              update: order.ProductInOrder?.map((item) => {
                return {
                  where: {
                    id: item.id,
                  },
                  data: {
                    price: item?.price as number,
                    index: item?.index as number,
                    // productId: item?.productId,
                    quantity: item?.quantity as number,
                    description: item?.description,
                  },
                };
              }),
            },
          },
        });

        if (!response)
          return { error: "Could not update order, please try again later!" };
        if (response) return { success: response };
      } else {
        const ProductInInvoiceOfOrderDeletion = order.ProductInOrder.map(
          async (item) => {
            return await db.productInInvoiceOfOrder.deleteMany({
              where: {
                productInOrderId: item.id,
              },
            });
          }
        );

        const invoiceDelete = await db.invoice.deleteMany({
          where: {
            orderId: order.id,
          },
        });

        const productsInOrdersDeletion = order.ProductInOrder?.map(
          async (item) => {
            return await db.productInOrder.deleteMany({
              where: {
                orderId: order.id,
              },
            });
          }
        );

        const response = await db.order.update({
          where: {
            id: order.id,
          },
          data: {
            orderNumber: order.orderNumber!,
            customerId: order.customerId as string,
            notes: order.notes,
            poDate: order.poDate,
            poNumber: order.poNumber,
            quotationNumber: order.quotationNumber,
            status: "PENDING",
            orderPDFFile: order.orderPDFFile,
            ProductInOrder: {
              create: order.ProductInOrder?.map((item) => {
                return {
                  price: item?.price as number,
                  index: item?.index as number,
                  // productId: item?.productId,
                  quantity: item?.quantity as number,
                  description: item?.description,
                  product: {
                    connect: {
                      id: item?.productId,
                    },
                  },
                };
              }),
            },
          },
        });
        if (!response)
          return { error: "Could not update order, please try again later!" };
        if (response) return { success: response };
      }
    }
  } else {
    // if (orderItemsIfAny) {
    //   const sortedArray1 = orderItemsIfAny.ProductInOrder.map((obj) =>
    //     JSON.stringify(obj)
    //   ).sort();
    //   const sortedArray2 = order.ProductInOrder.map((obj) =>
    //     JSON.stringify(obj)
    //   ).sort();

    //   const isSame = sortedArray1.every(
    //     (value, index) => value === sortedArray2[index]
    //   );

    //   if (isSame) {
    //     const response = await db.order.update({
    //       where: {
    //         id: order.id,
    //       },
    //       data: {
    //         orderNumber: order.orderNumber!,
    //         customerId: order.customerId as string,
    //         notes: order.notes,
    //         poDate: order.poDate,
    //         poNumber: order.poNumber,
    //         quotationNumber: order.quotationNumber,
    //         status: order.status,
    //         ProductInOrder: {
    //           update: order.ProductInOrder?.map((item) => {
    //             return {
    //               where: {
    //                 id: item.id,
    //               },
    //               data: {
    //                 price: item?.price as number,
    //                 index: item?.index as number,
    //                 // productId: item?.productId,
    //                 quantity: item?.quantity as number,
    //                 description: item?.description,
    //               },
    //             };
    //           }),
    //         },
    //       },
    //     });

    //     if (!response)
    //       return { error: "Could not update order, please try again later!" };
    //     if (response) return { success: response };
    //   }
    // }

    const productsInOrdersDeletion = order.ProductInOrder?.map(async (item) => {
      return await db.productInOrder.deleteMany({
        where: {
          orderId: order.id,
        },
      });
    });

    const response = await db.order.upsert({
      where: {
        id: order.id,
      },
      create: {
        orderNumber: order.orderNumber!,
        customerId: order.customerId as string,
        notes: order.notes,
        poDate: order.poDate,
        poNumber: order.poNumber,
        quotationNumber: order.quotationNumber,
        orderPDFFile: order.orderPDFFile,
        status: "PENDING",
        ProductInOrder: {
          create: order.ProductInOrder?.map((item) => {
            return {
              price: item?.price as number,
              index: item?.index as number,
              // productId: item?.productId,
              quantity: item?.quantity as number,
              description: item?.description,
              product: {
                connect: {
                  id: item?.productId,
                },
              },
            };
          }),
        },
      },
      update: {
        orderNumber: order.orderNumber!,
        customerId: order.customerId as string,
        notes: order.notes,
        poDate: order.poDate,
        poNumber: order.poNumber,
        quotationNumber: order.quotationNumber,
        orderPDFFile: order.orderPDFFile,
        status: "PENDING",
        ProductInOrder: {
          create: order.ProductInOrder?.map((item) => {
            return {
              price: item?.price as number,
              index: item?.index as number,
              // productId: item?.productId,
              quantity: item?.quantity as number,
              description: item?.description,
              product: {
                connect: {
                  id: item?.productId,
                },
              },
            };
          }),
        },
      },
    });

    // let response = "yes";
    if (!response)
      return { error: "Could not create quotation, please try again later!" };
    if (response) return { success: response };
  }
};

export const getOrderBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.order.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      customerId: true,
      notes: true,
      orderNumber: true,
      poNumber: true,
      poDate: true,
      quotationNumber: true,
      orderPDFFile: true,
      status: true,
      ProductInOrder: {
        select: {
          // index: true,
          index: true,
          certificateNumber: true,
          description: true,
          productId: true,
          price: true,
          quantity: true,
          supplied: true,
          id: true,
        },
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!response)
    return { error: "Could not find order, please try again later!" };
  if (response) return { success: response };
};

export const getOrderDetailsBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;
  const response = await db.order.findUnique({
    where: {
      id,
    },
    select: {
      createdAt: true,
      poDate: true,
      poNumber: true,
      quotationNumber: true,
      notes: true,
      status: true,
      orderNumber: true,
      orderPDFFile: true,
      customer: {
        select: {
          name: true,
          addressLine1: true,
          GST: true,
          pincode: true,
          state: true,
        },
      },
      ProductInOrder: {
        select: {
          id: true,
          // index: true,
          index: true,
          price: true,
          quantity: true,
          supplied: true,
          description: true,
          certificateNumber: true,
          product: {
            select: {
              name: true,
              typeNumber: true,
              protection: true,
              gasGroup: true,
              type: true,
            },
          },
        },
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!response)
    return { error: "Could not find order, please try again later!" };
  if (response) return { success: response };
};

export const updateOrder = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;
  const orderQuantity = await db.order.findUnique({
    where: {
      id,
    },
    select: {
      ProductInOrder: {
        select: {
          id: true,
          quantity: true,
        },
      },
    },
  });
  const response = await db.order.update({
    where: {
      id: id,
    },
    data: {
      status: "COMPLETED",
      ProductInOrder: {
        update: orderQuantity?.ProductInOrder.map((ord) => {
          return {
            where: {
              id: ord.id,
            },
            data: {
              supplied: ord.quantity,
            },
          };
        }),
      },
    },
  });
  if (!response)
    return { error: "Could not update order, please try again later!" };
  if (response) return { success: response };
};

export const fetchPendingCustomerProductsQuantity = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  if (!id) return { error: "Could not find id, please try again later!" };

  const response = await db.order.findMany({
    where: {
      AND: [
        {
          customerId: id,
        },
        {
          status: {
            not: "COMPLETED",
          },
        },
      ],
    },
    include: {
      customer: true,
      ProductInOrder: {
        where: {
          order: {
            status: {
              not: "COMPLETED",
            },
          },
        },
        include: {
          ProductInInvoiceOfOrder: true,
          order: true,
          product: true,
        },
      },
    },
  });
  if (!response)
    return { error: "Could not update order, please try again later!" };
  if (response) return { success: response };
};

export const fetchPendingProductsQuantity = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  if (!id) return { error: "Could not find id, please try again later!" };

  const response = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
      ProductInOrder: {
        where: {
          order: {
            status: {
              not: "COMPLETED",
            },
          },
        },
        include: {
          ProductInInvoiceOfOrder: true,
          order: {
            include: {
              customer: true,
            },
          },
        },
      },
    },
  });
  if (!response)
    return { error: "Could not update order, please try again later!" };
  if (response) return { success: response };
};

export const fetchCategoryForCatalog = async () => {
  const response = await db.category.findMany({
    where: {
      product: {
        some: {
          image: {
            not: "",
          },
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!response) return { error: "No Categoriess" };
  if (response) return { success: response };
};

export const getRandomProducts = async () => {
  const productCount = await db.product.count();
  const skip = Math.floor(Math.random() * productCount);

  const response = await db.product.findMany({
    where: {
      image: {
        not: "",
      },
    },
    select: {
      name: true,
      id: true,
      image: true,
    },
    skip: skip,
    take: 5,
  });

  if (!response) return { error: "No Products" };
  if (response) return { success: response };
};

export const getCategoriesAndProducts = async () => {
  const response = await db.category.findMany({
    where: {
      product: {
        some: {
          image: {
            not: "",
          },
        },
      },
    },
    include: {
      product: {
        select: {
          name: true,
          id: true,
          image: true,
          slug: true,
        },
      },
    },
  });
  if (!response) return { error: "No Categories" };
  if (response) return { success: response };
};

export const upsertStoreProduct = async (
  storeProduct: Partial<StoreProduct>
) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const response = await db.storeProduct.upsert({
    where: {
      id: storeProduct.id,
    },
    create: {
      name: storeProduct.name ?? "",
      description: storeProduct.description,
      StoreProductId: storeProduct.StoreProductId ?? "",
      image: storeProduct.image,
      slug: storeProduct.name
        ? encodeURIComponent(
            storeProduct.name?.toLowerCase().replace(/\//g, "-")
          )
        : "",
      qrCodeLink: storeProduct.qrCodeLink ?? "",
    },
    update: {
      name: storeProduct.name ?? "",
      description: storeProduct.description,
      StoreProductId: storeProduct.StoreProductId ?? "",
      image: storeProduct.image,
      slug: storeProduct.name
        ? encodeURIComponent(
            storeProduct.name?.toLowerCase().replace(/\//g, "-")
          )
        : "",
      qrCodeLink: storeProduct.qrCodeLink ?? "",
    },
  });

  if (!response) return { error: "No Products" };
  if (response) return { success: response };
};

export const getStoreProductDetailsBasedOnSlug = async (slug: string) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const response = await db.storeProduct.findFirst({
    where: {
      slug,
    },
  });
  if (!response)
    return { error: "Could not find product, please try again later!" };
  if (response) return { success: response };
};

export const deleteStoreProduct = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;
  const response = await db.storeProduct.delete({
    where: {
      id,
    },
  });
  if (!response)
    return { error: "Could not delete product, please try again later!" };
  if (response) return { success: response };
};

export const fetchStoreProductsForSelect = async () => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;
  const products = await db.storeProduct.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      slug: true,
      StoreProductId: true,
    },
    orderBy: {
      StoreProductId: "asc",
    },
  });

  if (!products) return { error: "No Products" };
  if (products) return { success: products };
};

export const upsertEmployee = async (employee: Partial<Employee>) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const response = await db.employee.upsert({
    where: {
      id: employee.id,
    },
    create: {
      name: employee.name ?? "",
      phoneNumber: employee.phoneNumber,
      image: employee.image,
      slug: employee.name
        ? encodeURI(employee.name?.toLowerCase().replace(/\//g, "-"))
        : "",
      aadharNumber: employee.aadharNumber,
    },
    update: {
      name: employee.name ?? "",
      phoneNumber: employee.phoneNumber,

      image: employee.image,
      slug: employee.name
        ? encodeURI(employee.name?.toLowerCase().replace(/\//g, "-"))
        : "",
      aadharNumber: employee.aadharNumber,
    },
  });

  if (!response) return { error: "No Categories" };
  if (response) return { success: response };
};

export const getCustomerDetailsBasedOnSlug = async (slug: string) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;
  const response = await db.employee.findUnique({
    where: {
      slug,
    },
  });

  if (!response) return { error: "No Categories" };
  if (response) return { success: response };
};

export const deleteEmployee = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const response = await db.employee.delete({
    where: {
      id,
    },
  });
  if (!response) return { error: "No Employee Found" };
  if (response) return { success: response };
};

export const fetchEmployeeForSelect = async () => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const response = await db.employee.findMany();

  if (!response) return { error: "No Employee Found" };
  if (response) return { success: response };
};

export const upsertInventory = async (
  inventory: Partial<Inventory> & {
    employeeId: string;
    storeProductId: string;
  }
) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  let response;

  // let response;
  if (inventory.employeeId !== "null") {
    response = await db.inventory.upsert({
      where: {
        id: inventory.id,
      },
      create: {
        quantity: inventory.quantity ?? "",
        status: inventory.status ?? "IN",
        employeeId: inventory.employeeId,
        storeProductId: inventory.storeProductId,
      },
      update: {
        quantity: inventory.quantity ?? "",
        status: inventory.status ?? "IN",
        employeeId: inventory.employeeId,
        storeProductId: inventory.storeProductId,
      },
    });
  } else if (inventory.employeeId === "null") {
    response = await db.inventory.upsert({
      where: {
        id: inventory.id,
      },
      create: {
        quantity: inventory.quantity ?? "",
        status: inventory.status ?? "IN",
        storeProductId: inventory.storeProductId,
      },
      update: {
        quantity: inventory.quantity ?? "",
        status: inventory.status ?? "IN",
        storeProductId: inventory.storeProductId,
      },
    });
  }
  // if (inventory.employeeId) {
  //   response = await db.inventory.upsert({
  //     where: {
  //       id: inventory.id,
  //     },
  //     create: {
  //       quantity: inventory.quantity ?? "",
  //       employee: {
  //         connect: {
  //           id: inventory.employeeId,
  //         },
  //       },

  //       storeProduct: {
  //         connect: {
  //           StoreProductId: inventory.storeProductId,
  //         },
  //       },
  //       status: inventory.status ?? "IN",
  //     },
  //     update: {
  //       quantity: inventory.quantity ?? "",
  //       employee: {
  //         connect: {
  //           id: inventory.employeeId,
  //         },
  //       },
  //       storeProduct: {
  //         connect: {
  //           StoreProductId: inventory.storeProductId,
  //         },
  //       },
  //       status: inventory.status ?? "IN",
  //     },
  //   });
  // } else {
  //   response = await db.inventory.upsert({
  //     where: {
  //       id: inventory.id,
  //     },
  //     create: {
  //       quantity: inventory.quantity ?? "",
  //       storeProduct: {
  //         connect: {
  //           StoreProductId: inventory.storeProductId,
  //         },
  //       },
  //       status: inventory.status ?? "IN",
  //     },
  //     update: {
  //       quantity: inventory.quantity ?? "",
  //       storeProduct: {
  //         connect: {
  //           StoreProductId: inventory.storeProductId,
  //         },
  //       },
  //       status: inventory.status ?? "IN",
  //     },
  //   });
  // }
  if (!response) return { error: "Could not save inventory" };
  if (response) return { success: response };
};

export const getStockData = async () => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const stockData = await db.inventory.findMany({
    select: {
      quantity: true,
      status: true,
      storeProduct: {
        select: {
          name: true,
          StoreProductId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { success: stockData };
};

export const getCategoriesWithProductsForCatalog = async () => {
  const response = await db.category.findMany({
    where: {
      product: {
        some: {
          image: {
            not: "",
          },
        },
      },
    },
    select: {
      name: true,
      product: {
        where: {
          image: {
            not: "",
          },
        },
        select: {
          name: true,
          image: true,
          gasGroup: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  revalidatePath("/catalog");

  if (!response) return { error: "No Products Found" };
  if (response) return { success: response };
};

export const createTestCertificate = async (values: any) => {
  return;
};

export const fetchCustomersWithPenndingOrderForSelect = async () => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const customers = await db.customer.findMany({
    where: {
      Order: {
        some: {
          status: {
            not: "COMPLETED",
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!customers) return { error: "No Customers" };
  if (customers) return { success: customers };
};

export const fetchPONumberBasedOnCustomer = async (id: string) => {
  if (!id) return { error: "No Id Provided" };

  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.order.findMany({
    where: {
      AND: [
        {
          customerId: id,
        },
        {
          status: {
            not: "COMPLETED",
          },
        },
      ],
    },
    select: {
      id: true,
      poNumber: true,
      orderNumber: true,
      Invoice: {
        select: {
          ProductInInvoiceOfOrder: {
            select: {
              supplidQuantity: true,
            },
          },
        },
      },
    },
  });
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getOrderDetailsForInvoice = async (id: string) => {
  if (!id) return { error: "No Id Provided" };

  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.order.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      ProductInOrder: {
        include: {
          product: true,
        },
      },
      Invoice: {
        include: {
          ProductInInvoiceOfOrder: true,
        },
      },
    },
  });
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const upsertInvoice = async (value: InvoiceCreationSchemaRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const order = await db.order.findUnique({
    where: {
      id: value.orderId,
    },
    include: {
      ProductInOrder: true,
    },
  });

  if (!order) return;

  const existingInvoice = await db.invoice.findUnique({
    where: { id: value.id },
    include: {
      ProductInInvoiceOfOrder: {
        include: {
          ProductInOrder: {
            select: {
              id: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (existingInvoice) {
    const existingItemIds = existingInvoice?.ProductInInvoiceOfOrder.map(
      (item) => item.id
    );

    const newProductIds = value.items?.map((prod) => prod?.id);
    const productsToDelete = existingItemIds?.filter(
      (id) => !newProductIds?.includes(id)
    );

    await db.productInInvoiceOfOrder.deleteMany({
      where: { id: { in: productsToDelete } },
    });

    const response = await db.invoice.upsert({
      where: {
        id: value.id,
      },
      create: {
        invoiceDate: value.invoiceDate,
        invoiceNumber: value.invoiceNumber.trim(),
        invoiceNumberSlug: encodeURI(
          value.invoiceNumber.trim().replace(/\//g, "%")
        ),
        LrNumber: value.LrNumber,
        LrUrl: value.LrUrl,
        transportName: value.transportName,
        order: {
          connect: {
            id: value.orderId,
          },
        },
        ProductInInvoiceOfOrder: {
          create: value.items.map((product) => {
            return {
              certificateNumber: product.certificateNumber ?? "",
              supplidQuantity: product.suppliedQuantity,
              typeNumber: product.typeNumber ?? "",
              numberOfBoxes: product.numberOfBoxes ?? 0,
              productInOrderId: product.orderProductInOrderId,
            };
          }),
        },
      },
      update: {
        invoiceDate: value.invoiceDate,
        invoiceNumber: value.invoiceNumber.trim(),
        invoiceNumberSlug: encodeURI(
          value.invoiceNumber.trim().replace(/\//g, "%")
        ),
        LrNumber: value.LrNumber,
        LrUrl: value.LrUrl,
        transportName: value.transportName,
        order: {
          connect: {
            id: value.orderId,
          },
        },
        ProductInInvoiceOfOrder: {
          upsert: value.items.map((product) => {
            return {
              where: {
                id: product.id,
              },
              create: {
                certificateNumber: product.certificateNumber ?? "",
                productInOrderId: product.orderProductInOrderId,
                supplidQuantity: product.suppliedQuantity,
                typeNumber: product.typeNumber ?? "",
                numberOfBoxes: product.numberOfBoxes ?? 0,
              },
              update: {
                certificateNumber: product.certificateNumber ?? "",
                productInOrderId: product.orderProductInOrderId,
                supplidQuantity: product.suppliedQuantity,
                typeNumber: product.typeNumber ?? "",
                numberOfBoxes: product.numberOfBoxes ?? 0,
              },
            };
          }),
        },
      },
    });

    const invoices = await db.invoice.findMany({
      where: {
        orderId: value.orderId,
      },
      include: {
        ProductInInvoiceOfOrder: true,
      },
    });

    const productLengthCheck = areQuantitiesEqual(order, invoices);

    if (productLengthCheck) {
      await db.order.update({
        where: {
          id: value.orderId,
        },
        data: {
          status: "COMPLETED",
        },
      });
    } else {
      await db.order.update({
        where: {
          id: value.orderId,
        },
        data: {
          status: "PARTIAL_COMPLETED",
        },
      });
    }

    if (!response)
      return { error: "Could not create quotation, please try again later!" };
    if (response) return { success: { id: existingInvoice.id } };
  } else {
    const response = await db.invoice.create({
      data: {
        invoiceDate: value.invoiceDate,
        invoiceNumber: value.invoiceNumber.trim(),
        invoiceNumberSlug: encodeURI(
          value.invoiceNumber.trim().replace(/\//g, "%")
        ),
        LrNumber: value.LrNumber,
        LrUrl: value.LrUrl,
        transportName: value.transportName,
        order: {
          connect: {
            id: value.orderId,
          },
        },
        ProductInInvoiceOfOrder: {
          create: value.items.map((product) => {
            return {
              certificateNumber: product.certificateNumber ?? "",
              ProductInOrder: {
                connect: {
                  id: product.orderProductInOrderId,
                },
              },
              supplidQuantity: product.suppliedQuantity,
              typeNumber: product.typeNumber ?? "",
              numberOfBoxes: product.numberOfBoxes ?? 0,
            };
          }),
        },
      },

      include: {
        ProductInInvoiceOfOrder: true,
      },
    });

    const invoices = await db.invoice.findMany({
      where: {
        orderId: value.orderId,
      },
      include: {
        ProductInInvoiceOfOrder: true,
      },
    });

    const productLengthCheck = areQuantitiesEqual(order, invoices);

    if (productLengthCheck) {
      await db.order.update({
        where: {
          id: value.orderId,
        },
        data: {
          status: "COMPLETED",
        },
      });
    } else {
      await db.order.update({
        where: {
          id: value.orderId,
        },
        data: {
          status: "PARTIAL_COMPLETED",
        },
      });
    }
    // let response = "yes";
    if (!response)
      return { error: "Something went wrong, Please try again later" };
    if (response) return { success: response };
  }
};

export const editInvoice = async (value: InvoiceCreationSchemaRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const order = await db.order.findUnique({
    where: {
      id: value.orderId,
    },
    include: {
      ProductInOrder: true,
    },
  });

  if (!order) return;

  const response = await db.invoice.update({
    where: {
      id: value.id,
    },
    data: {
      invoiceNumber: value.invoiceNumber.trim(),
      invoiceNumberSlug: encodeURI(
        value.invoiceNumber.trim().replace(/\//g, "%")
      ),
      invoiceDate: value.invoiceDate,
      LrNumber: value.LrNumber,
      LrUrl: value.LrUrl,
      transportName: value.transportName,
      ProductInInvoiceOfOrder: {
        update: value.items.map((item) => {
          return {
            where: {
              id: item.id,
            },
            data: {
              certificateNumber: item.certificateNumber,
              numberOfBoxes: item.numberOfBoxes,
              supplidQuantity: item.suppliedQuantity,
              typeNumber: item.typeNumber,
            },
          };
        }),
      },
    },

    include: {
      ProductInInvoiceOfOrder: true,
    },
  });

  const invoices = await db.invoice.findMany({
    where: {
      orderId: value.orderId,
    },
    include: {
      ProductInInvoiceOfOrder: true,
    },
  });

  const productLengthCheck = areQuantitiesEqual(order, invoices);

  if (productLengthCheck) {
    await db.order.update({
      where: {
        id: value.orderId,
      },
      data: {
        status: "COMPLETED",
      },
    });
  } else {
    await db.order.update({
      where: {
        id: value.orderId,
      },
      data: {
        status: "PARTIAL_COMPLETED",
      },
    });
  }

  // let response = "yes";
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getInvoiceDetailsBasedOnInvoiceNumber = async (
  invoiceNumber: string
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.invoice.findUnique({
    where: {
      invoiceNumberSlug: invoiceNumber,
    },
    include: {
      order: {
        select: {
          orderNumber: true,
          poNumber: true,
          poDate: true,
          quotationNumber: true,
          customer: {
            select: {
              name: true,
              addressLine1: true,
              GST: true,
              pincode: true,
              state: true,
            },
          },
        },
      },
      ProductInInvoiceOfOrder: {
        include: {
          ProductInOrder: {
            select: {
              id: true,
              // index: true,
              index: true,
              price: true,
              quantity: true,
              supplied: true,
              description: true,
              certificateNumber: true,
              product: {
                select: {
                  name: true,
                  typeNumber: true,
                  protection: true,
                  gasGroup: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getInvoiceDetails = async (invoiceNumber: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.invoice.findUnique({
    where: {
      invoiceNumberSlug: invoiceNumber,
    },
    include: {
      order: {
        include: {
          ProductInOrder: true,
          customer: true,
        },
      },
      ProductInInvoiceOfOrder: {
        include: {
          ProductInOrder: {
            select: {
              product: {
                select: {
                  name: true,
                },
              },
              description: true,
              quantity: true,
            },
          },
        },
      },
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getStoreProductsForPrint = async () => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;

  const response = await db.storeProduct.findMany({});

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getEmployees = async () => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;
  const response = await db.employee.findMany({
    select: {
      name: true,
      id: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getInventoryData = async (currentPage: number) => {
  const user = await auth();
  if (!user || user.user.role === "USER") return null;
  const response = await db.inventory.findMany({
    select: {
      id: true,
      employee: {
        select: {
          name: true,
        },
      },
      quantity: true,
      storeProduct: true,
      status: true,
      createdAt: true,
    },
    take: 10,
    skip: (currentPage - 1) * 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  // const response = await db.storeProduct.findMany();
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const upsertChallan = async (challan: ChallanCreationRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const existingQuotation = await db.deliveryChallan.findUnique({
    where: { id: challan.id },
    include: {
      ProductInChallan: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (existingQuotation) {
    const existingItemIds = existingQuotation?.ProductInChallan.map(
      (item) => item.id
    );

    const newProductIds = challan.ProductInChallan?.map((prod) => prod?.id);

    const productsToDelete = existingItemIds?.filter(
      (id) => !newProductIds?.includes(id)
    );
    await db.productInQuotation.deleteMany({
      where: { id: { in: productsToDelete } },
    });
  }

  const response = await db.deliveryChallan.upsert({
    where: {
      id: challan.id ?? ObjectID().toString(),
    },
    create: {
      challanNumber: challan.challanNumber,
      additionalNotes: challan.additionalNotes,
      customerId: challan.customerId ?? "",
      causeOfChallan: challan.causeOfChallan,
      status: challan.status,
      challanDate: challan.challanDate ?? new Date(),
      poDate: challan.poDate ?? new Date(),
      poNumber: challan.poNumber ?? "",

      ProductInChallan: {
        create: challan.ProductInChallan.map((product) => {
          return {
            productId: product.productId,
            index: product?.index,
            price: Number(product?.price) ?? 1,
            quantity: String(product?.quantity),
            description: product.description,

            // product: {
            //   connect: {
            //     id: product.productId,
            //   },
            // },
          };
        }),
      },
    },
    update: {
      challanNumber: challan.challanNumber,
      additionalNotes: challan.additionalNotes,
      customerId: challan.customerId ?? "",
      causeOfChallan: challan.causeOfChallan,
      status: challan.status,
      challanDate: challan.challanDate ?? new Date(),
      poDate: challan.poDate,
      poNumber: challan.poNumber ?? "",
      ProductInChallan: {
        upsert: challan.ProductInChallan.map((product) => {
          return {
            where: {
              id: product.id ?? ObjectID().toString(),
            },
            create: {
              productId: product.productId,
              index: product?.index,
              price: Number(product?.price) ?? 1,
              quantity: String(product?.quantity),
              description: product.description,
            },
            update: {
              productId: product.productId,
              index: product?.index,
              price: Number(product?.price) ?? 1,
              quantity: String(product?.quantity),
              description: product.description,
            },
          };
        }),
      },
    },
  });

  // let response = "yes";

  if (!response)
    return { error: "Could not create quotation, please try again later!" };
  if (response) return { success: response };
};

export const updateChallanStatusToClose = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.deliveryChallan.update({
    where: {
      id,
    },
    data: {
      status: "CLOSE",
    },
  });
  if (!response)
    return { error: "Could not create quotation, please try again later!" };
  if (response) return { success: response };
};

export const deleteChallan = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  await db.productInChallan.deleteMany({
    where: {
      challanId: id,
    },
  });

  const response = await db.deliveryChallan.delete({
    where: {
      id: id,
    },
  });

  if (!response)
    return { error: "Could not delete challan, please try again later!" };
  if (response) return { success: "Challan has been deleted." };
};

export const getChallanDetailsBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;
  const response = await db.deliveryChallan.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      ProductInChallan: {
        include: {
          product: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (!response)
    return { error: "Could not find challan, please try again later!" };
  if (response) return { success: response };
};

export const fetchPreviousPerfomaNumber = async () => {
  const response = await db.perfomaInvoice.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      perfomaInvoiceNumber: true,
    },
  });

  if (!response) return { error: "No Perfoma Invoice Number" };
  if (response) return { success: response };
};

export const upsertPerfomaInvoice = async (
  value: PerfomaInvoiceCreationSchemaRequest
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const order = await db.order.findUnique({
    where: {
      id: value.orderId,
    },
    include: {
      ProductInOrder: true,
    },
  });

  if (!order) return;

  const response = await db.perfomaInvoice.upsert({
    where: {
      id: value.id,
    },
    create: {
      perfomaInvoiceNumber: value.perfomaInvoiceNumber,
      perfomaInvoiceDate: value.perfomaInvoiceDate,
      paymentStatus: value.paymentStatus,
      additionalNotes: value.additionalNotes,
      orderId: value.orderId!,
      shippingCharges: value.shippingCharges,
      ProductInPerfomaInvoiceOfOrder: {
        create: value.ProductInPerfomaInvoiceOfOrder.map((product) => {
          return {
            productInOrderId: product.orderProductInOrderId,
            supplidQuantity: product.suppliedQuantity,
          };
        }),
      },
    },
    update: {
      perfomaInvoiceNumber: value.perfomaInvoiceNumber,
      perfomaInvoiceDate: value.perfomaInvoiceDate,
      paymentStatus: value.paymentStatus,
      additionalNotes: value.additionalNotes,
      orderId: value.orderId!,
      shippingCharges: value.shippingCharges,
      ProductInPerfomaInvoiceOfOrder: {
        create: value.ProductInPerfomaInvoiceOfOrder.map((product) => {
          return {
            productInOrderId: product.orderProductInOrderId,
            supplidQuantity: product.suppliedQuantity,
          };
        }),
      },
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getPerfomaInvoiceDetailsBasedOnIPerfomanvoiceNumber = async (
  id: string
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.perfomaInvoice.findUnique({
    where: {
      id: id,
    },
    include: {
      order: {
        select: {
          orderNumber: true,
          poNumber: true,
          poDate: true,
          customer: {
            select: {
              name: true,
              addressLine1: true,
              GST: true,
              pincode: true,
              state: true,
            },
          },
        },
      },
      ProductInPerfomaInvoiceOfOrder: {
        include: {
          ProductInOrder: {
            select: {
              id: true,
              // index: true,
              index: true,
              price: true,
              quantity: true,
              supplied: true,
              description: true,
              product: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const updatePaymentStatusOfPerfomaInvoice = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.perfomaInvoice.update({
    where: {
      id,
    },
    data: {
      paymentStatus: "RECEIVED",
    },
  });
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const deletePerfoma = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  await db.productInPerfomaInvoiceOfOrder.deleteMany({
    where: {
      perfomaInvoiceId: id,
    },
  });

  const response = await db.perfomaInvoice.delete({
    where: {
      id,
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getPerfomaInvoiceDetails = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.perfomaInvoice.findUnique({
    where: {
      id,
    },
    include: {
      ProductInPerfomaInvoiceOfOrder: {
        include: {
          ProductInOrder: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const getTodos = async () => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const response = await db.todo.findMany({
    where: {
      OR: [
        { completed: false }, // All pending todos
        {
          AND: [
            { completed: true }, // Completed todos
            {
              updatedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
          ],
        },
      ],
    },
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const upsertTodo = async (values: TaskCreationRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.todo.upsert({
    where: {
      id: values.id,
    },
    create: {
      text: values.task,
      completed: false,
      dueDate: values.dueDate,
      priority: values.priority,
      userId: user.user.id,
    },
    update: {
      text: values.task,
      completed: false,
      dueDate: values.dueDate,
      priority: values.priority,
      userId: user.user.id,
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const updateTodo = async (id: string, status: boolean) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.todo.update({
    where: {
      id,
    },
    data: {
      completed: status ? false : true,
      updatedAt: new Date(),
    },
  });
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const todoDelete = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.todo.delete({
    where: {
      id,
    },
  });
  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

export const deleteOrder = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  await db.productInInvoiceOfOrder.deleteMany({
    where: {
      ProductInOrder: {
        orderId: id,
      },
    },
  });

  await db.invoice.deleteMany({
    where: {
      orderId: id,
    },
  });
  await db.perfomaInvoice.deleteMany({
    where: {
      orderId: id,
    },
  });

  await db.productInPerfomaInvoiceOfOrder.deleteMany({
    where: {
      ProductInOrder: {
        orderId: id,
      },
    },
  });

  await db.productInOrder.deleteMany({
    where: {
      orderId: id,
    },
  });

  const order = await db.order.findUnique({
    where: {
      id,
    },
    select: {
      quotationNumber: true,
    },
  });

  if (order?.quotationNumber) {
    await db.quotation.update({
      where: {
        uniqueQuotationNumber: order.quotationNumber,
      },
      data: {
        orderNumber: null,
      },
    });
  }

  const response = await db.order.delete({
    where: {
      id: id,
    },
  });

  if (!response)
    return { error: "Something went wrong, Please try again later" };
  if (response) return { success: response };
};

// //////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
