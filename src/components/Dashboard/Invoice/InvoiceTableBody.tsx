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
import { InvoiceTable, OrderTable } from "@/lib/types";
import { format } from "date-fns";
import { updateOrder } from "@/lib/queries";
import { toast } from "@/components/ui/use-toast";

interface InvoiceTableBodyProps {
  invoice: InvoiceTable[];
}

const InvoiceTableBody: FC<InvoiceTableBodyProps> = ({ invoice }) => {
  const router = useRouter();
  return (
    <div>
      {invoice.map((invo) => {
        return (
          <div
            className="border-b transition-colors hover:bg-muted/50 "
            key={invo.id}
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal w-32">
                {invo.invoiceNumber}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {invo.order.customer.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-60">
                {invo.order.poNumber}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                {format(invo.order.poDate as Date, "PP")}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                {invo.order.orderNumber}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-20 lg:flex hidden">
                {invo.ProductInInvoiceOfOrder.length}
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
                      onClick={() => {
                        if (
                          invo.ProductInInvoiceOfOrder.some(
                            (cert) => !cert.certificateNumber
                          )
                        ) {
                          console.log("its herwe");

                          toast({
                            description:
                              "Test certificate cannot be generated as there are some certificate numbers missing.",
                          });
                        }

                        router.push(`/invoice/view/${invo.invoiceNumber}`);
                      }}
                    >
                      View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/invoice/${invo.invoiceNumber}`)
                      }
                    >
                      Edit Invoice
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

export default InvoiceTableBody;
