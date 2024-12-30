"use client";

import { format } from "date-fns";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { TransactionTable } from "@/lib/types";

interface TransactionTableBodyProps {
  transaction: TransactionTable[];
}

const TransactionTableBody: FC<TransactionTableBodyProps> = ({
  transaction,
}) => {
  const router = useRouter();

  return (
    <div>
      {transaction.map((invo) => {
        return (
          <div
            className="border-b transition-colors hover:bg-muted/50  "
            key={invo.id}
          >
            <div className="px-4 text-left align-middle font-medium grid grid-cols-7 items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {invo.status}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1 break-words">
                {invo.inwardType}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {invo.supplier.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {invo.user?.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1 lg:flex hidden">
                {invo.weight}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1 lg:flex hidden">
                {invo.createdAt
                  ? format(invo.createdAt as Date, "PP")
                  : format(new Date(), "PP")}
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                    //   onClick={() =>

                    //     router.push(
                    //       `/transacio/view/${encodeURI(
                    //         invo.invoiceNumber.replace(/\//g, "%")
                    //       )}`
                    //     );
                    //   }}
                    >
                      View Transaction
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/aluminum/transactions/${invo.id}`)
                      }
                    >
                      Edit Transaction
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

export default TransactionTableBody;
