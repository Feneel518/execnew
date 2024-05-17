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
import { Quotationtable } from "@/lib/types";
import { format } from "date-fns";
import { deleteQuotation } from "@/lib/queries";

interface QuotationTableBodyProps {
  quotation: Quotationtable[];
}

const QuotationTableBody: FC<QuotationTableBodyProps> = ({ quotation }) => {
  const router = useRouter();
  return (
    <div>
      {quotation.map((quot) => {
        return (
          <div className="border-b transition-colors hover:bg-muted/50 ">
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal w-32">
                {quot.quotationNumber}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {quot.customer.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex hidden">
                {format(quot.createdAt, "PP")}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-20 lg:flex hidden">
                {quot.ProductInQuotation.length}
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
                      onClick={() => navigator.clipboard.writeText(quot.id)}
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => window.open(`/quotation/view/${quot.id}`)}
                    >
                      {" "}
                      View Quotation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/quotations/${quot.id}`)
                      }
                    >
                      {" "}
                      Edit Quotation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        await deleteQuotation(quot.id);
                        router.refresh();
                      }}
                    >
                      Delete Quotation
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

export default QuotationTableBody;
