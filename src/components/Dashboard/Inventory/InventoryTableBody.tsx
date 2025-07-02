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
import { Inventorytable } from "@/lib/types";
import { format } from "date-fns";

interface InventoryTableBodyProps {
  inventory: Inventorytable[];
}

const InventoryTableBody: FC<InventoryTableBodyProps> = ({ inventory }) => {
  const router = useRouter();
  return (
    <div>
      {inventory.map((invent) => {
        return (
          <div
            key={invent.id}
            className="border-b transition-colors hover:bg-muted/50 "
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {invent.storeProduct?.name}
                {/* {invent.storeProduct?.name} |{" "}
                {invent.storeProduct?.StoreProductId} */}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1 lg:flex hidden">
                {invent.status}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {invent.employee?.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1 lg:flex hidden">
                {invent.quantity}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {format(invent.createdAt, "PP")}
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
                      onClick={() =>
                        navigator.clipboard.writeText(invent.id as string)
                      }
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/inventory/${invent.id}`)
                      }
                    >
                      {" "}
                      View Inventory
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryTableBody;
