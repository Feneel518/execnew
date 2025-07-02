"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteQuotation, updateOrder } from "@/lib/queries";
import { toast } from "../ui/use-toast";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
  id: string;
  orderNumber: string;
  poNumber?: string | null;
  poDate?: string | null;
  clientName: string;
  itemsLength: number;
};

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "poNumber",
    header: "PO Number",
  },
  {
    accessorKey: "poDate",
    header: "PO Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "itemsLength",
    header: "No. Of Items",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      const router = useRouter();
      return (
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
              onClick={() => router.push(`/dashboard/orders/${order.id}`)}
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
      );
    },
  },
];
