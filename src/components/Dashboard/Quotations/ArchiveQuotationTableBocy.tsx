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
import { ArchiveQuotationtable, Quotationtable } from "@/lib/types";
import { format } from "date-fns";
import { deleteQuotation } from "@/lib/queries";
import { cn } from "@/lib/utils";

interface ArchiveQuotationTableBocyProps {
  quotation: ArchiveQuotationtable[];
}

const ArchiveQuotationTableBocy: FC<ArchiveQuotationTableBocyProps> = ({
  quotation,
}) => {
  const router = useRouter();
  return (
    <div>
      {quotation.map((quot) => {
        return (
          <>
            <div
              key={quot.id}
              className="border-b transition-colors hover:bg-muted/50 max-lg:hidden"
            >
              <div
                className={cn(
                  `px-4 text-left align-middle font-medium flex items-center transition-colors duration-200 ease-in-out`,
                  {
                    "bg-green-200 hover:bg-green-100": quot.orderNumber,
                  }
                )}
              >
                <div className="p-4 align-middle text-sm font-normal w-32">
                  {quot.quotationNumber}
                </div>
                <div className="p-4 align-middle text-sm font-normal flex-1">
                  {quot.customer.name}
                </div>
                <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex">
                  {quot.orderNumber && (
                    <div className="">ExOR - {quot.orderNumber}</div>
                  )}
                </div>
                <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex hidden">
                  {format(quot.createdAt, "PP")}
                </div>
                <div className="p-4 align-middle text-sm font-normal lg:w-20 lg:flex hidden">
                  {quot.ArchivedProductInQuotation.length}
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
                        onClick={() =>
                          window.open(`/archiveQuotation/view/${quot.id}`)
                        }
                      >
                        View Quotation
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/quotations/${quot.id}`)
                        }
                      >
                        Edit Quotation
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="lg:hidden">
              <div
                key={quot.id}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50 p-4 flex items-center justify-between",
                  {
                    "bg-green-200 hover:bg-green-100": quot.orderNumber,
                  }
                )}
              >
                <div className="flex flex-col">
                  <div className="flex gap-3 items-center">
                    <div className="">ExQN-{quot.quotationNumber}</div>
                    <div className="text-xs">
                      {format(quot.createdAt, "PP")}
                    </div>
                  </div>
                  <div className="">{quot.customer.name}</div>
                  {quot.orderNumber && (
                    <div className="text-sm"> ExOR-{quot.orderNumber}</div>
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

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(`/quotation/view/${quot.id}`)
                        }
                      >
                        View Quotation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/quotations/${quot.id}`)
                        }
                      >
                        Edit Quotation
                      </DropdownMenuItem>
                      {!quot.orderNumber && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/quotations/convert-to-order/${quot.id}`
                              )
                            }
                          >
                            Convert to order
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* <div
                  className={cn(
                    `px-4 text-left align-middle font-medium flex items-center transition-colors duration-200 ease-in-out`,
                    {
                      "bg-green-200 hover:bg-green-100": quot.orderNumber,
                    }
                  )}
                >
                  <div className="p-4 align-middle text-sm font-normal w-32">
                    {quot.quotationNumber}
                  </div>
                  <div className="p-4 align-middle text-sm font-normal flex-1">
                    {quot.customer.name}
                  </div>
                  <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex">
                    {quot.orderNumber && (
                      <div className="">ExOR - {quot.orderNumber}</div>
                    )}
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

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`/quotation/view/${quot.id}`)
                          }
                        >
                          View Quotation
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/quotations/${quot.id}`)
                          }
                        >
                          Edit Quotation
                        </DropdownMenuItem>
                        {!quot.orderNumber && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/quotations/convert-to-order/${quot.id}`
                                )
                              }
                            >
                              Convert to order
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div> */}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default ArchiveQuotationTableBocy;
