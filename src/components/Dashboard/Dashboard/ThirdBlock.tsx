import { db } from "@/lib/db";
import { formatPrice, getThisMonthsDate } from "@/lib/utils";
import { startOfMonth } from "date-fns";
import { FC } from "react";
import { HiDotsVertical } from "react-icons/hi";

interface ThirdBlockProps {}

const ThirdBlock: FC<ThirdBlockProps> = async ({}) => {
  const dates = getThisMonthsDate();

  const quotations = await db.quotation.findMany({
    where: {
      archived: false,
    },
    select: {
      createdAt: true,
      ProductInQuotation: {
        select: {
          price: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  //

  const thisMonthsQuotations = quotations.filter(
    (a) =>
      a.createdAt >= dates.firstDayOfMonth &&
      a.createdAt < dates.firstDayOfNextMonth
  );

  const month = thisMonthsQuotations.map((a) => {
    return a.ProductInQuotation.reduce((b, c) => {
      return (
        b +
        Number(c.price) *
          (c.quantity !== "UR" ? Number(c.quantity?.replace(/[^0-9]/g, "")) : 0)
      );
    }, 0);
  });

  const monthlyQuoattaionAmount =
    month.length > 0
      ? month.reduce((a, b) => {
          return a + b;
        })
      : 0;

  const total = quotations.map((a) => {
    return a.ProductInQuotation.reduce((b, c) => {
      return (
        b +
        Number(c.price) *
          (c.quantity !== "UR" ? Number(c.quantity?.replace(/[^0-9]/g, "")) : 0)
      );
    }, 0);
  });

  const totalQuoattaionAmount =
    total.length > 0
      ? total.reduce((a, b) => {
          return a + b;
        })
      : 0;

  return (
    <div className="bg-black/10 row-span-2 text-woodsmoke-200 flex flex-col justify-between p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="uppercase">Quotations this month</div>
        <div className="">
          <HiDotsVertical />
        </div>
      </div>
      <div className="flex flex-col  justify-between gap-2">
        <div className="flex items-end justify-between w-full">
          <h1 className="text-5xl lg:text-7xl">
            {thisMonthsQuotations.length}
          </h1>
          <div className="text-sm lg:text-lg">/ {quotations.length}</div>
        </div>
        <div className=" h-[1px] bg-white/50 w-full"></div>
        <div className="flex items-end justify-between w-full">
          <h1 className="uppercase max-sm:text-xs">Total</h1>
          <div className="text-xs sm:text-sm lg:text-lg">
            {formatPrice(monthlyQuoattaionAmount)} /{" "}
            {formatPrice(totalQuoattaionAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdBlock;
