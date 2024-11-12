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
import { InvoiceTable, OrderTable, PerfomaInvoiceTable } from "@/lib/types";
import { format } from "date-fns";
import {
  deletePerfoma,
  updateOrder,
  updatePaymentStatusOfPerfomaInvoice,
} from "@/lib/queries";
import { toast } from "@/components/ui/use-toast";
import { cn, formatPrice } from "@/lib/utils";
interface PerformaInvoiceBodyProps {
  invoice: PerfomaInvoiceTable[];
}

const PerformaInvoiceBody: FC<PerformaInvoiceBodyProps> = ({ invoice }) => {
  const router = useRouter();

  return (
    <div>
      {invoice.map((invo) => {
        const total = invo.ProductInPerfomaInvoiceOfOrder.reduce(
          (acc, total) => {
            return acc + total.supplidQuantity * total.ProductInOrder.price;
          },
          0
        );
        return (
          <div
            className={cn(`border-b transition-colors hover:bg-muted/50 `, {
              "bg-green-200 hover:bg-green-100":
                invo.paymentStatus === "RECEIVED",
            })}
            key={invo.id}
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal w-32">
                {invo.perfomaInvoiceNumber}
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
              <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                {invo.paymentStatus}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-20 lg:flex hidden">
                {formatPrice(total)}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-40 text-right">
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
                        router.push(`/perfoma/view/${invo.id}`);
                      }}
                    >
                      View Perfoma Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/dashboard/perfoma/${invo.id}?orderId=${invo.orderId}`
                        )
                      }
                    >
                      Edit Perfoma Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem
                      onClick={async () => {
                        const response =
                          await updatePaymentStatusOfPerfomaInvoice(invo.id);

                        if (response) {
                          router.refresh();
                          return toast({
                            title: `Payment received for perfoma Invoice number ${invo.perfomaInvoiceNumber}.`,
                          });
                        }
                      }}
                    >
                      Payment Received
                    </DropdownMenuItem>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem
                      onClick={async () => {
                        const response = await deletePerfoma(invo.id);

                        if (response) {
                          router.refresh();
                          return toast({
                            title: `Perfoma Invoice Number ${invo.perfomaInvoiceNumber} deleted.`,
                          });
                        }
                      }}
                    >
                      Delete Perfoma Invoice
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

export default PerformaInvoiceBody;
