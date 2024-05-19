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

interface StockTableBodyProps {
  items: {
    productname: string;
    inwardTotal: number;
    outwardTotal: number;
    inStock: number;
  }[];
}

const StockTableBody: FC<StockTableBodyProps> = ({ items }) => {
  const router = useRouter();
  return (
    <div>
      {items.map((prod) => {
        return (
          <div
            key={prod.productname}
            className="border-b transition-colors hover:bg-muted/50 "
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.productname}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.inwardTotal}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.outwardTotal}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {prod.inStock}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StockTableBody;
