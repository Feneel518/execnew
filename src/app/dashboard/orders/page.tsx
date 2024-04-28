import { DataTable } from "@/components/Dashboard/Customers/data-table";
import { ordersColumns } from "@/components/columns/ordersColumns";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { OrderColumns } from "@/lib/types";

import clsx from "clsx";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}



const page: FC<pageProps> = async ({}) => {
  const orders = await db.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      poNumber: true,
      poDate: true,
      status: true,
      customer: {
        select: {
          name: true,
        },
      },
      ProductInOrder: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let OrderCompleted = orders.filter((a) => a.status === "COMPLETED");
  let OrderPending = orders.filter((a) => a.status !== "COMPLETED");

  let orderCompletedData: {
    id: string;
    orderNumber: string;
    poNumber?: string | null;
    poDate?: string | null;
    clientName: string;
    itemsLength: number;
    status: string;
  }[] = [];
  OrderCompleted.map((cust) => {
    return orderCompletedData.push({
      clientName: cust.customer.name,
      id: cust.id,
      itemsLength: cust.ProductInOrder.length,
      orderNumber: cust.orderNumber.toString().padStart(4, "0"),
      poDate: format(cust.poDate as Date, "PP"),
      poNumber: cust.poNumber,
      status: cust.status,
    });
  });

  let orderData: {
    id: string;
    orderNumber: string;
    poNumber?: string | null;
    poDate?: string | null;
    clientName: string;
    itemsLength: number;
    status: string;
  }[] = [];
  OrderPending.map((cust) => {
    return orderData.push({
      clientName: cust.customer.name,
      id: cust.id,
      itemsLength: cust.ProductInOrder.length,
      orderNumber: cust.orderNumber.toString().padStart(4, "0"),
      poDate: format(cust.poDate as Date, "PP"),
      poNumber: cust.poNumber,
      status: cust.status,
    });
  });

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of Orders</div>
        <Link
          href={"/dashboard/orders/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            <DataTable
              isOrder={true}
              columns={ordersColumns}
              data={orderData}
            ></DataTable>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <h1>Completed Orders</h1>
        <Card>
          <CardContent>
            <DataTable
              isOrder={true}
              columns={ordersColumns}
              data={orderCompletedData}
            ></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
