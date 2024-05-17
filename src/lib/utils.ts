import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
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
