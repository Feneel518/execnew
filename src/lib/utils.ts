import { Prisma } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import { ProductInInvoiceTable } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number, long?: boolean) => {
  if (long) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  } else {
    if (price >= 10000000) {
      return (
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(price / 10000000) + "Cr"
      );
    } else if (price >= 100000) {
      return (
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(price / 100000) + "L"
      );
    } else {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(price);
    }
  }
};

export const incrementStoreId = (id: string | undefined) => {
  if (!id) return "ExEC-SP-01";
  let parts = id.split("-");
  let numericPart = parts[parts.length - 1];

  let incrememtedNumber = parseInt(numericPart) + 1;

  let newNumericPart = incrememtedNumber
    .toString()
    .padStart(numericPart.length, "0");

  parts[parts.length - 1] = newNumericPart;
  return parts.join("-");
};

export const getThisMonthsDate = () => {
  const now = new Date();
  // Get the first day of the current month
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // Get the first day of the next month
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  return { firstDayOfMonth, firstDayOfNextMonth };
};

export const areQuantitiesEqual = (
  order: Prisma.OrderGetPayload<{
    include: {
      ProductInOrder: true;
    };
  }>,
  invoices: Prisma.InvoiceGetPayload<{
    include: {
      ProductInInvoiceOfOrder: true;
    };
  }>[]
) => {
  // if (order.ProductInOrder.length !== invoice.ProductInInvoiceOfOrder.length) {
  //   return false;
  // }
  const orderQuantities = order.ProductInOrder.reduce((acc, product) => {
    acc[product.id] = product.quantity;
    return acc;
  }, {} as Record<string, number>);

  //

  const accumulatedInvoiceQuantities = accumulateInvoiceQuantities(invoices);

  for (const productId in orderQuantities) {
    if (
      orderQuantities[productId] !== accumulatedInvoiceQuantities[productId]
    ) {
      return false;
    }
  }

  return true;
};

export const accumulateInvoiceQuantities = (
  invoices: Prisma.InvoiceGetPayload<{
    include: {
      ProductInInvoiceOfOrder: true;
    };
  }>[],
  excludeInvoiceId?: string // Optional parameter to exclude a specific invoice
) => {
  return invoices.reduce((acc, invoice) => {
    if (invoice.id === excludeInvoiceId) {
      return acc; // Skip this invoice
    }
    for (const product of invoice.ProductInInvoiceOfOrder) {
      if (!acc[product.productInOrderId]) {
        acc[product.productInOrderId] = 0;
      }
      acc[product.productInOrderId] += product.supplidQuantity;
    }
    return acc;
  }, {} as Record<string, number>);
};

export const calculateRemainingQuantities = (
  order: Prisma.OrderGetPayload<{
    include: {
      ProductInOrder: true;
    };
  }>,
  invoices: Prisma.InvoiceGetPayload<{
    include: {
      ProductInInvoiceOfOrder: true;
    };
  }>[],
  excludeInvoiceId?: string // Optional parameter to exclude a specific invoice
) => {
  const orderQuantities = order.ProductInOrder.reduce((acc, product) => {
    acc[product.id] = product.quantity;
    return acc;
  }, {} as Record<string, number>);

  const acc = accumulateInvoiceQuantities(invoices, excludeInvoiceId);
  const remainingQuantities = { ...orderQuantities };

  for (const productId in acc) {
    if (remainingQuantities[productId] !== undefined) {
      remainingQuantities[productId] -= acc[productId];
    }
  }
  return remainingQuantities;
};

export const taxAmountCalculation = (items: ProductInInvoiceTable[]) => {
  const abc = items.reduce((acc, item) => {
    return acc + item.supplidQuantity * item.ProductInOrder.price;
  }, 0);

  return { taxAmount: abc * 0.18, totalAmount: abc * 1.18 };
};

export function assignContinuousIndices<T>(
  ...arrays: T[][]
): (T & { index: number })[][] {
  let globalIndex = 0;

  return arrays.map((array) =>
    array.map((item) => ({
      ...item,
      index: ++globalIndex,
    }))
  );
}
