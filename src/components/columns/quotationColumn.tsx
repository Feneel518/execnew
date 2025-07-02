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
import { deleteQuotation } from "@/lib/queries";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Quotation = {
  id: string;
  quotationNumber: string;
  clientName: string;
  itemsLength: number;
};

export const quotationColumn: ColumnDef<Quotation>[] = [
  {
    accessorKey: "quotationNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quotation Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: "Client",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "itemsLength",
    header: "No. Of Items",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const quotation = row.original;
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
              onClick={() => navigator.clipboard.writeText(quotation.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(`/quotation/view/${quotation.id}`)}
            >
              {" "}
              View Quotation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/quotations/${quotation.id}`)
              }
            >
              {" "}
              Edit Quotation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await deleteQuotation(quotation.id);
                router.refresh();
              }}
            >
              Delete Quotation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
