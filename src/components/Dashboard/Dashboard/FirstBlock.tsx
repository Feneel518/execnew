import { db } from "@/lib/db";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { HiDotsVertical } from "react-icons/hi";

interface FirstBlockProps {}

const FirstBlock: FC<FirstBlockProps> = async ({}) => {
  const orders = await db.order.findMany({
    select: {
      status: true,
    },
  });
  const completedOrders = orders.filter((a) => a.status !== "COMPLETED");
  return (
    <div>
      {" "}
      <div className="bg-bamboo-500 p-4 lg:p-8 text-woodsmoke-200 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="uppercase">Pending order status</div>
          <Link
            href={"/dashboard/orders"}
            className=" hover:bg-black rounded-full p-1 transition-all duration-100 ease-in-out"
          >
            <ArrowUpRight />
          </Link>
        </div>
        <div className="flex items-end justify-between">
          <div className="">
            <h1 className="text-5xl lg:text-7xl">{completedOrders.length}</h1>
          </div>
          <div className="text-sm lg:text-lg">/ {orders.length}</div>
        </div>
      </div>
    </div>
  );
};

export default FirstBlock;
