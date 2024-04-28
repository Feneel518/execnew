"use server";
import { getUserByEmail } from "@/data/user";
import {
  LoginSchema,
  LoginSchemaRequest,
  NewPasswordSchema,
  NewPasswordSchemaRequest,
  RegisterSchema,
  RegisterSchemaRequest,
  ResetSchema,
  ResetSchemaRequest,
} from "./Validators";
import { db } from "./db";
import {
  generatePasswordResetToken,
  generateVerificationToken,
  generatetwoFactorToken,
} from "./tokens";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import { getTwoFactorConfirmationByUserid } from "@/data/twoFactorConfirmation";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/data/passwordToken";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import {
  Category,
  Customer,
  Order,
  Product,
  ProductComponents,
  ProductInOrder,
  Quotation,
} from "@prisma/client";
import { ProductInQuotation, QuotationType } from "./types";

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
  console.log({ product });

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
      },

      create: {
        image: category.image as string,
        name: category.name as string,
        slug: category.slug as string,
      },
    });
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.log(error);

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
    console.log(error);

    return new Response("Something went wrong.");
  }
};

export const getProductDetailsBasedOnSlug = async (slug: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;
  try {
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
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.log(error);

    return new Response("Something went wrong.");
  }
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
    console.log(error);

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

export const upsertQuotation = async (
  quotation: Partial<
    Quotation & {
      items: Partial<ProductInQuotation[]>;
    }
  >
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  console.log(quotation);

  const componentsDeletion = quotation.items?.map(async (item) => {
    if (item?.id) {
      return await db.componentsOfProductInQuotation.deleteMany({
        where: {
          productInQuotation: {
            quotationId: quotation.id,
          },
        },
      });
    } else {
      return;
    }
  });

  const componentsOfQuotationDeletion = quotation.items?.map(async (item) => {
    if (item?.id) {
      return await db.componentsOfQuotation.deleteMany({
        where: {
          ComponentsOfProductInQuotation: {
            every: {
              productInQuotation: {
                quotationId: quotation.id,
              },
            },
          },
        },
      });
    } else {
      return;
    }
  });

  const response = await db.quotation.upsert({
    where: {
      id: quotation.id,
    },
    update: {
      deliveryDate: quotation.deliveryDate ?? "",
      gst: quotation.gst ?? "CGST_SGST_18",
      quotationNumber: quotation.quotationNumber ?? 1,
      additionalNotes: quotation.additionalNotes ?? "",
      clientName: quotation.clientName ?? "",
      customerId: quotation.customerId ?? "",
      discount: quotation.discount ?? "",
      packingCharges: quotation.packingCharges ?? "INCLUDED",
      paymentTerms: quotation.paymentTerms ?? "ADVANCE",
      transportationPayment: quotation.transportationPayment ?? "TO_PAY",
      deliverDateNew: quotation.deliverDateNew,
      ProductInQuotation: {
        upsert: quotation.items?.map((item) => {
          return {
            where: {
              id: item?.id,
            },
            update: {
              product: {
                connect: {
                  id: item?.productId,
                },
              },
              index: item?.index,
              cableEntry: item?.cableEntry,
              cutoutSize: item?.cutoutSize,
              earting: item?.earting,
              gasket: item?.gasket,
              glass: item?.glass,
              hardware: item?.hardware,
              HorsePower: item?.HorsePower,
              hsnCode: item?.hsnCode,
              kW: item?.kW,
              plateSize: item?.plateSize,
              mounting: item?.mounting,
              poReferrence: item?.poReferrence,
              rating: item?.rating,
              rpm: item?.rpm,
              size: item?.size,
              terminals: item?.terminals,
              typeNumber: item?.typeNumber,
              variant: item?.variant,
              wireGuard: item?.wireGuard,
              price: Number(item?.price) ?? 1,
              quantity: item?.quantity,
              ComponentsOfProductInQuotation: {
                create: item?.components.map((ite) => {
                  return {
                    componentsOfQuotation: {
                      create: {
                        item: ite.items,
                      },
                    },
                  };
                }),
              },
            },
            create: {
              product: {
                connect: {
                  id: item?.productId,
                },
              },
              index: item?.index,
              cableEntry: item?.cableEntry,
              cutoutSize: item?.cutoutSize,
              earting: item?.earting,
              gasket: item?.gasket,
              glass: item?.glass,
              hardware: item?.hardware,
              HorsePower: item?.HorsePower,
              hsnCode: item?.hsnCode,
              kW: item?.kW,
              plateSize: item?.plateSize,
              mounting: item?.mounting,
              poReferrence: item?.poReferrence,
              rating: item?.rating,
              rpm: item?.rpm,
              size: item?.size,
              terminals: item?.terminals,
              typeNumber: item?.typeNumber,
              variant: item?.variant,
              wireGuard: item?.wireGuard,
              price: Number(item?.price) ?? 1,
              quantity: item?.quantity,
              ComponentsOfProductInQuotation: {
                create: item?.components.map((ite) => {
                  return {
                    componentsOfQuotation: {
                      create: {
                        item: ite.items,
                      },
                    },
                  };
                }),
              },
            },
          };
        }),
      },
    },
    create: {
      deliveryDate: quotation.deliveryDate ?? "",
      gst: quotation.gst ?? "CGST_SGST_18",
      quotationNumber: quotation.quotationNumber ?? 1,
      additionalNotes: quotation.additionalNotes ?? "",
      clientName: quotation.clientName ?? "",
      customerId: quotation.customerId ?? "",
      discount: quotation.discount ?? "",
      packingCharges: quotation.packingCharges ?? "INCLUDED",
      paymentTerms: quotation.paymentTerms ?? "ADVANCE",
      transportationPayment: quotation.transportationPayment ?? "TO_PAY",
      deliverDateNew: quotation.deliverDateNew,
      ProductInQuotation: {
        create: quotation.items?.map((item) => {
          return {
            // productId: item?.productId,
            product: {
              connect: {
                id: item?.productId,
              },
            },
            cableEntry: item?.cableEntry,
            cutoutSize: item?.cutoutSize,
            earting: item?.earting,
            gasket: item?.gasket,
            glass: item?.glass,
            hardware: item?.hardware,
            HorsePower: item?.HorsePower,
            hsnCode: item?.hsnCode,
            kW: item?.kW,
            plateSize: item?.plateSize,
            mounting: item?.mounting,
            poReferrence: item?.poReferrence,
            rating: item?.rating,
            rpm: item?.rpm,
            size: item?.size,
            terminals: item?.terminals,
            typeNumber: item?.typeNumber,
            variant: item?.variant,
            wireGuard: item?.wireGuard,
            price: Number(item?.price) ?? 1,
            quantity: item?.quantity,
            ComponentsOfProductInQuotation: {
              create: item?.components.map((ite) => {
                return {
                  componentsOfQuotation: {
                    create: {
                      item: ite.items,
                    },
                  },
                };
              }),
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

export const upsertOrder = async (
  order: Partial<
    Order & {
      ProductInOrder: Partial<ProductInOrder[]>;
    }
  >
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  console.log(order.ProductInOrder);

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
      status: order.status,
      ProductInOrder: {
        create: order.ProductInOrder?.map((item) => {
          return {
            price: item?.price as number,
            // productId: item?.productId,
            quantity: item?.quantity as number,
            certificateNumber: item?.certificateNumber,
            description: item?.description,
            supplied: item?.supplied,
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
      status: order.status,
      ProductInOrder: {
        create: order.ProductInOrder?.map((item) => {
          return {
            price: item?.price as number,
            // productId: item?.productId,
            quantity: item?.quantity as number,
            certificateNumber: item?.certificateNumber,
            description: item?.description,
            supplied: item?.supplied,
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
      status: true,
      ProductInOrder: {
        select: {
          certificateNumber: true,
          description: true,
          productId: true,
          price: true,
          quantity: true,
          supplied: true,
          id: true,
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
          price: true,
          quantity: true,
          supplied: true,
          description: true,
          certificateNumber: true,
          product: {
            select: {
              name: true,
            },
          },
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

export const fetchPendingProductsQuantity = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  if (!id) return { error: "Could not update order, please try again later!" };

  const response = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
      ProductInOrder: {
        where: {
          order: {
            status: "PENDING" || "PARTIAL_COMPLETED",
          },
        },
        include: {
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
