import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
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
