"use client";

import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArchiveOrderTable, OrderTable } from "@/lib/types";
import { format } from "date-fns";
import { updateOrder } from "@/lib/queries";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ArchiveOrderTableBodyProps {
  orders: ArchiveOrderTable[];
}

const ArchiveOrderTableBody: FC<ArchiveOrderTableBodyProps> = ({ orders }) => {
  const router = useRouter();
  return (
    <div className="">
      {orders.map((order) => {
        return (
          <>
            <div
              className={`border-b transition-colors hover:bg-muted/50 max-lg:hidden ${
                order.status === "COMPLETED" && "bg-green-200"
              }`}
              key={order.id}
            >
              <div className="px-4 text-left align-middle font-medium flex items-center     ">
                <div className="p-4 align-middle text-sm font-normal w-32">
                  {order.orderNumber}
                </div>
                <div className="p-4 align-middle text-sm font-normal flex-1">
                  {order.customer.name}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-60">
                  {order.poNumber}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                  {order.poDate && format(order.poDate as Date, "PP")}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                  {order.status}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-20 lg:flex hidden">
                  {order.ArchiveProductInOrder.length}
                </div>
                <div className="p-4 align-middle text-sm font-normal lg:w-40">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem
                        onClick={() => window.open(`/order/view/${order.id}`)}
                      >
                        View Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/orders/${order.id}`)
                        }
                      >
                        Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/workorders/${order.id}`)}
                      >
                        Generate Work Order
                      </DropdownMenuItem>

                      {/* <DropdownMenuItem
              onClick={async () => {
                await deleteQuotation(order.id);
                router.refresh();
                }}
                >
                Delete Order
                </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="lg:hidden">
              <div
                key={order.id}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50 p-4 flex items-center justify-between",
                  {
                    "bg-green-200": order.status === "COMPLETED",
                  }
                )}
              >
                <div className="flex flex-col">
                  <div className="flex gap-3 items-center">
                    <div className="">
                      ExOr-{order.orderNumber} | {order.status}
                    </div>
                  </div>
                  <div className="">{order.customer.name}</div>
                  <div className="">{order.poNumber}</div>
                  {order.poDate && (
                    <div className="text-xs">{format(order.poDate, "PP")}</div>
                  )}
                </div>

                <div className="p-4 align-middle text-sm font-normal lg:w-40">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem
                        onClick={() => window.open(`/order/view/${order.id}`)}
                      >
                        View Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/orders/${order.id}`)
                        }
                      >
                        Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/workorders/${order.id}`)}
                      >
                        Generate Work Order
                      </DropdownMenuItem>

                      {/* <DropdownMenuItem
              onClick={async () => {
                await deleteQuotation(order.id);
                router.refresh();
                }}
                >
                Delete Order
                </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ArchiveOrderTableBody;
