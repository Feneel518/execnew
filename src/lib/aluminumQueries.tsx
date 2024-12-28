"use server";

import { auth } from "@/auth";
import { db } from "./db";
import { ALUMINUMTYPE, TRANSACTIONSTATUS } from "@prisma/client";
import {
  AluminumClientCreationRequest,
  AluminumTransactionCreationRequest,
  CastingProdcutsCreationRequest,
} from "./Validators/AllAluminumValidators";

export const upsertAluminumClient = async (
  value: AluminumClientCreationRequest
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.aluminumClient.upsert({
    where: {
      id: value.id,
    },
    create: {
      name: value.name,
      addressLine1: value.address ?? "",
      GST: value.GST?.toUpperCase() ?? "",
      phoneNumber: value.phoneNumber ?? "",
      type: value.type,
      slug: value.slug ?? "",
    },
    update: {
      name: value.name,
      addressLine1: value.address ?? "",
      GST: value.GST?.toUpperCase() ?? "",
      phoneNumber: value.phoneNumber ?? "",
      type: value.type,
      updatedAt: new Date(),
      slug: value.slug ?? "",
    },
  });

  if (!response)
    return { error: "Could not create customer, please try again later!" };
  if (response) return { success: response };
};

export const getAluminumClientDetailsBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.aluminumClient.findUnique({
    where: {
      id,
    },
  });
  if (!response)
    return { error: "Could not create customer, please try again later!" };
  if (response) return { success: response };
};

export const getSuppliers = async () => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.aluminumClient.findMany({
    select: {
      name: true,
      id: true,
      type: true,
    },
  });

  if (!response)
    return { error: "Could not find suppliers, please try again later!" };
  if (response) return { success: response };
};
export const fetchCastingForSelect = async () => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.castings.findMany({});

  if (!response)
    return { error: "Could not find products, please try again later!" };
  if (response) return { success: response };
};
export const fetchDocketForSelect = async (id?: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;
  if (!id) return { error: "No docket found." };

  const response = await db.aluminumTransaction.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              inwardType: "ALUMINUM",
            },
            {
              status: "OUT",
            },
          ],
        },
        {
          supplierId: id,
        },
      ],
    },
    select: {
      docketNumber: true,
      weight: true,
      status: true,
      aluminumType: true,
    },
  });

  const groupedData: Record<string, { IN: number; OUT: number; TYPE: string }> =
    response.reduce((acc, entry) => {
      const { docketNumber, status, weight, aluminumType } = entry;
      // @ts-ignore
      if (!acc[docketNumber]) {
        // @ts-ignore
        acc[docketNumber] = {
          IN: 0,
          OUT: 0,
          TYPE: aluminumType,
        };
      }
      // @ts-ignore
      acc[docketNumber][status] += weight;
      return acc;
    }, {});

  const filteredDockets = Object.entries(groupedData)
    .filter(([_, weights]) => weights.IN !== weights.OUT)
    .map(([docketNumber, a]) => {
      return {
        docketNumber: docketNumber,
        type: a.TYPE,
      };
    });

  if (!response)
    return { error: "Could not find supplier, please try again later!" };
  if (response) return { success: filteredDockets };
};
export const upserAluminumTransaction = async (
  value: AluminumTransactionCreationRequest
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const existingTransaction = await db.aluminumTransaction.findUnique({
    where: {
      id: value.id,
    },
    include: {
      CastingForTransaction: {
        select: {
          id: true,
        },
      },
      TransactionCalculation: {
        select: {
          id: true,
        },
      },
    },
  });

  if (existingTransaction) {
    const exisitingCalculationIds =
      existingTransaction.TransactionCalculation.map((id) => id.id);
    const newCalculationIds = value.TransactionCalculation?.map((id) => id.id);

    const exisitingCastingIds = existingTransaction.CastingForTransaction.map(
      (id) => id.id
    );
    const newCastingIds = value.Castings?.map((id) => id.id);

    const calculatiionsToDelete = exisitingCalculationIds?.filter(
      (id) => !newCalculationIds?.includes(id)
    );
    const castingsToDelete = exisitingCastingIds?.filter(
      (id) => !newCastingIds?.includes(id)
    );

    await db.transactionCalculation.deleteMany({
      where: {
        id: {
          in: calculatiionsToDelete,
        },
      },
    });

    await db.castingForTransaction.deleteMany({
      where: {
        id: {
          in: castingsToDelete,
        },
      },
    });

    const response = await db.aluminumTransaction.update({
      where: {
        id: value.id,
      },
      data: {
        docketDate: value.docketDate ?? new Date(),
        docketNumber: value.docketNumber,
        status: value.status,
        weight: Number(value.weight),
        aluminumType: value.aluminumType,
        inwardType: value.inwardType,
        price: Number(value.price),
        quantity: Number(value.quantity),
        quantityType: value.quantityType,
        supplierId: value.supplierId,
        userId: value.userId,
        CastingForTransaction: {
          upsert: value.Castings?.map((casting) => {
            return {
              where: {
                id: casting.id,
              },
              create: {
                castingsId: casting.castingId,
                description: casting.description,
                quantity: Number(casting.quantity),
                weight: Number(casting.weight),
              },
              update: {
                castingsId: casting.castingId,
                description: casting.description,
                quantity: Number(casting.quantity),
                weight: Number(casting.weight),
              },
            };
          }),
        },
        TransactionCalculation: {
          upsert: value.TransactionCalculation?.map((trans) => {
            return {
              where: {
                id: trans.id,
              },
              create: {
                index: trans.index,
                weight: Number(trans.weight),
                quantity: Number(trans.quantity),
                quantityType: trans.quantityType,
              },
              update: {
                index: trans.index,
                weight: Number(trans.weight),
                quantity: Number(trans.quantity),
                quantityType: trans.quantityType,
              },
            };
          }),
        },
      },
    });

    if (existingTransaction.weight > value.weight) {
      const difference = existingTransaction.weight - value.weight;

      if (
        value.inwardType === "ALUMINUM" ||
        value.inwardType === "REPLACE_ALUMINUM" ||
        value.status === "OUT"
      ) {
        AluminumStockUpdate(
          value.status,
          value.aluminumType!,
          difference,
          false
        );
      } else if (value.inwardType === "RETURNABLE") {
        AluminumStockUpdate(
          value.status,
          value.aluminumType!,
          difference,
          true
        );
      }
    } else if (existingTransaction.weight < value.weight) {
      const difference = value.weight - existingTransaction.weight;

      if (
        value.inwardType === "ALUMINUM" ||
        value.inwardType === "REPLACE_ALUMINUM" ||
        value.status === "OUT"
      ) {
        AluminumStockUpdate(
          value.status,
          value.aluminumType!,
          difference,
          true
        );
      } else if (value.inwardType === "RETURNABLE") {
        AluminumStockUpdate(
          value.status,
          value.aluminumType!,
          difference,
          false
        );
      }
    }
    if (!response)
      return { error: "Could not update transaction, please try again later!" };
    if (response) return { success: response };
  } else {
    const response = await db.aluminumTransaction.create({
      data: {
        docketDate: value.docketDate ?? new Date(),
        docketNumber: value.docketNumber,
        status: value.status,
        weight: Number(value.weight),
        aluminumType: value.aluminumType,
        inwardType: value.inwardType,
        price: Number(value.price),
        quantity: Number(value.quantity),
        quantityType: value.quantityType,
        supplierId: value.supplierId,
        userId: value.userId,
        CastingForTransaction: {
          create: value.Castings?.map((casting) => {
            return {
              castingsId: casting.castingId,
              description: casting.description,
              quantity: Number(casting.quantity),
              weight: Number(casting.weight),
            };
          }),
        },
        TransactionCalculation: {
          create: value.TransactionCalculation?.map((trans) => {
            return {
              index: trans.index,
              weight: Number(trans.weight),
              quantity: Number(trans.quantity),
              quantityType: trans.quantityType,
            };
          }),
        },
      },
    });

    if (response && value.inwardType === "ALUMINUM" && value.aluminumType) {
      AluminumStockUpdate(value.status, value.aluminumType, value.weight, true);
    }

    if (
      response &&
      (value.inwardType === "RETURNABLE" ||
        value.inwardType === "REPLACE_ALUMINUM" ||
        value.status === "OUT")
    ) {
      if (value.inwardType === "RETURNABLE") {
        AluminumStockUpdate(
          value.status,
          value.aluminumType!,
          value.weight,
          false
        );
      } else if (
        value.inwardType === "REPLACE_ALUMINUM" ||
        value.status === "OUT"
      ) {
        AluminumStockUpdate(
          value.status,
          value.aluminumType!,
          value.weight,
          true
        );
      }
    }
    if (!response)
      return { error: "Could not update transaction, please try again later!" };
    if (response) return { success: response };
  }
};

export const deleteTransaction = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  await db.transactionCalculation.deleteMany({
    where: {
      aluminumTransactionId: id,
    },
  });

  await db.castingForTransaction.deleteMany({
    where: {
      aluminumTransactionId: id,
    },
  });

  const transaction = await db.aluminumTransaction.findUnique({
    where: {
      id,
    },
    select: {
      weight: true,
      aluminumType: true,
      inwardType: true,
      status: true,
    },
  });

  if (
    transaction?.inwardType === "ALUMINUM" ||
    transaction?.inwardType === "REPLACE_ALUMINUM" ||
    transaction?.status === "OUT"
  ) {
    AluminumStockUpdate(
      transaction.status,
      transaction.aluminumType!,
      transaction.weight,
      false
    );
  } else if (transaction?.inwardType === "RETURNABLE") {
    AluminumStockUpdate(
      transaction.status,
      transaction.aluminumType!,
      transaction.weight,
      true
    );
  }

  const response = await db.aluminumTransaction.delete({
    where: {
      id,
    },
  });

  if (!response)
    return { error: "Could not delete transaction, please try again later!" };
  if (response) return { success: response };
};

export const AluminumStockUpdate = async (
  type: TRANSACTIONSTATUS,
  aluminumType: ALUMINUMTYPE,
  weight: number,
  increment: boolean
) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  if (increment) {
    const response = await db.aluminumStock.upsert({
      where: {
        month_year_aluminumType_status: {
          aluminumType: aluminumType,
          month: new Date().getUTCMonth(),
          year: new Date().getUTCFullYear(),
          status: type,
        },
      },
      create: {
        aluminumType: aluminumType,
        month: new Date().getUTCMonth(),
        year: new Date().getUTCFullYear(),
        weight: Number(weight),
        status: type,
      },
      update: {
        aluminumType: aluminumType,
        month: new Date().getUTCMonth(),
        year: new Date().getUTCFullYear(),
        weight: {
          increment: Number(weight),
        },
      },
    });
    if (!response)
      return { error: "Could not find products, please try again later!" };
    if (response) return { success: response };
  } else {
    const response = await db.aluminumStock.upsert({
      where: {
        month_year_aluminumType_status: {
          aluminumType: aluminumType,
          month: new Date().getUTCMonth(),
          year: new Date().getUTCFullYear(),
          status: type,
        },
      },
      create: {
        aluminumType: aluminumType,
        month: new Date().getUTCMonth(),
        year: new Date().getUTCFullYear(),
        weight: Number(weight),
        status: type,
      },
      update: {
        aluminumType: aluminumType,
        month: new Date().getUTCMonth(),
        year: new Date().getUTCFullYear(),
        weight: {
          decrement: Number(weight),
        },
      },
    });
    if (!response)
      return { error: "Could not find products, please try again later!" };
    if (response) return { success: response };
  }
};

export const getTransactionBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.aluminumTransaction.findUnique({
    where: {
      id,
    },
    include: {
      TransactionCalculation: true,
      CastingForTransaction: true,
      supplier: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!response)
    return { error: "Could not find transaction, please try again later!" };
  if (response) return { success: response };
};

export const upsertCasting = async (values: CastingProdcutsCreationRequest) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.castings.upsert({
    where: {
      id: values.id,
    },
    create: {
      name: values.name,
      description: values.description,
      weight: values.weight,
      slug: encodeURI(values.name?.toLowerCase().replace(/\//g, "-")),
      productId: values.productId,
    },
    update: {
      name: values.name,
      description: values.description,
      weight: values.weight,
      slug: encodeURI(values.name?.toLowerCase().replace(/\//g, "-")),
      productId: values.productId,
    },
  });
  if (!response)
    return { error: "Could not find transaction, please try again later!" };
  if (response) return { success: response };
};

export const getCastingDetailsBasedOnId = async (id: string) => {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") return null;

  const response = await db.castings.findUnique({
    where: {
      id,
    },
  });
  if (!response)
    return { error: "Could not find products, please try again later!" };
  if (response) return { success: response };
};

// export const getAluminumStock = async () => {
//   const user = await auth();
//   if (!user || user.user.role !== "ADMIN") return null;

//   const response = await db.aluminumStock.findMany({
//     where: {
//       AND: [
//         {
//           month: new Date().getUTCMonth(),
//         },
//         {
//           status: "IN",
//         },
//       ],
//     },
//   });

//   const outwards = await db.aluminumStock.findMany({
//     where: {
//       AND: [
//         {
//           month: new Date().getUTCMonth(),
//         },
//         {
//           status: "OUT",
//         },
//       ],
//     },
//   });

//   // interface NetWeightRecord {
//   //   aluminumType: string;
//   //   netWeight: number;
//   // }
//   const combined = [...response, ...outwards];

//   const netWeight = combined.reduce<
//     {
//       aluminumType: string;
//       netWeight: number;
//     }[]
//   >((acc, total) => {
//     const { aluminumType, status, weight } = total;

//     const existing = acc.find((el) => el.aluminumType === aluminumType);

//     if (existing) {
//       existing.netWeight += status === "IN" ? weight : -weight;
//     } else {
//       acc.push({
//         aluminumType,
//         netWeight: status === "IN" ? weight : -weight,
//       });
//     }

//     return acc;
//   }, []);

//   if (!response)
//     return { error: "Could not find products, please try again later!" };
//   if (response) return { success: netWeight };
// };

// export const getSupplierAluminumStock = async (
//   docketNumber: string,
//   supplierId?: string
// ) => {
//   const user = await auth();
//   if (!user || user.user.role !== "ADMIN") return null;

//   const response = await db.aluminumTransaction.findMany({
//     where: {
//       AND: [
//         {
//           supplierId: supplierId,
//         },
//         {
//           docketNumber: docketNumber,
//         },
//       ],
//     },
//   });

//   console.log(response);

//   if (!response)
//     return { error: "Could not find products, please try again later!" };
//   if (response) return { success: response };
// };