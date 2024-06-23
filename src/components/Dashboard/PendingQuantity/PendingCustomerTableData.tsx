"use client";
import { PendingCustomerTable } from "@/lib/types";

import { FC } from "react";
import { useRouter } from "next/navigation";
import SmallHeading from "@/components/Global/SmallHeading";
import { cn } from "@/lib/utils";
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
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { updateOrder } from "@/lib/queries";
import { toast } from "@/components/ui/use-toast";

interface PendingCustomerTableDataProps {
  order: PendingCustomerTable[];
}

const PendingCustomerTableData: FC<PendingCustomerTableDataProps> = ({
  order,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="print:hidden">
        {order.map((order) => {
          return (
            <div
              className="border-b transition-colors hover:bg-muted/50  "
              key={order.id}
            >
              <div className="px-4 text-left align-middle font-medium flex items-center     ">
                <div className="p-4 align-middle text-sm font-normal w-32">
                  {order.orderNumber}
                </div>
                <div className="p-4 align-middle text-sm font-normal flex-1 flex flex-col divide-y-2">
                  {order.ProductInOrder.map((prod) => {
                    return (
                      <div className="grid grid-cols-3 gap-2">
                        <p>{prod.product.name}</p>
                        <p>{prod.description}</p>
                        <p>{prod.quantity}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-60">
                  {order.poNumber}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                  {format(order.poDate as Date, "PP")}
                </div>
                <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                  {order.status}
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
                        onClick={async () => {
                          const response = await updateOrder(order.id);
                          router.refresh();

                          if (response?.success) {
                            return toast({
                              title: `Your order (${order.orderNumber}), has been updated`,
                            });
                          } else if (response?.error) {
                            return toast({
                              title: response.error,
                            });
                          }
                        }}
                      >
                        Mark as Complete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => window.open(`/order/view/${order.id}`)}
                      >
                        {" "}
                        View Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/orders/${order.id}`)
                        }
                      >
                        {" "}
                        Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/workorders/${order.id}`)}
                      >
                        {" "}
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
          );
        })}
      </div>

      <div className=" flex-col gap-2  hidden print:flex">
        {order.map((ord) => {
          return (
            <div
              className={cn(
                "w-[210mm] h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col"
              )}
            >
              <SmallHeading></SmallHeading>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Order Number</TableHead>
                    <TableHead className="w-[300px]">Items</TableHead>
                    <TableHead className="w-[50px]">PO Number</TableHead>

                    <TableHead className="text-right w-[50px]">
                      Po Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <Table>
                <>
                  <TableRow key={ord.id} className="">
                    <TableCell className="font-medium">
                      {ord.orderNumber}
                    </TableCell>
                    <TableCell className="flex flex-col gap-2 divide-y-2">
                      {ord.ProductInOrder.map((prod) => {
                        return (
                          <div className="flex flex-col ">
                            <div className="">
                              <p>{prod.product.name}</p>
                            </div>
                            <div className="grid grid-cols-2">
                              <p>{prod.description}</p>
                              <p>{prod.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell className="text-right">{ord.poNumber}</TableCell>

                    <TableCell className="text-right">
                      {format(ord.poDate as Date, "PP")}
                    </TableCell>
                  </TableRow>
                  <Separator></Separator>
                </>
              </Table>
              {/* <div className="">{heading}</div>
      <div className="flex-1 relative px-8 py-4">
      <FitContent onResize={onResize}>{table}</FitContent>
      {additionalNotes && (
        <div className="font-bold">Notes: {additionalNotes}</div>
        )}
        </div>
        <div className="">{footer}</div> */}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PendingCustomerTableData;
