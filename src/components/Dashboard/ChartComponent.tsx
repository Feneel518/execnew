import { db } from "@/lib/db";
import { FC } from "react";

import OrderChart from "../Global/OrderChart";
import { Order } from "@prisma/client";

interface ChartComponentProps {}
const ChartComponent: FC<ChartComponentProps> = async ({}) => {
  const orders = await db.order.findMany({
    select: {
      createdAt: true,
    },
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const groupedOrders: { [key: string]: Partial<Order>[] } = {};

  orders.forEach((order) => {
    const month = monthNames[new Date(order.createdAt).getMonth()];

    if (!groupedOrders[month]) {
      groupedOrders[month] = [];
    }

    groupedOrders[month].push(order);
  });

  const results = Object.keys(groupedOrders).map((month) => {
    return {
      name: month,
      numberOfOrders: groupedOrders[month].length,
    };
  });

  return (
    <div>
      <div className="flex items-end justify-between">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl ">
          {orders.length} <span className="text-xs"> orders</span>
        </h1>
        <div className="">
          <OrderChart results={results}></OrderChart>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
