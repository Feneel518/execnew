"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { updateChallanStatusToClose } from "@/lib/queries";
import { challanTable } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface ChallanTableBodyProps {
  challan: challanTable[];
}

const ChallanTableBody: FC<ChallanTableBodyProps> = ({ challan }) => {
  const router = useRouter();
  return (
    <div>
      {challan.map((quot) => {
        return (
          <div
            key={quot.id}
            className={cn(
              "border-b transition-colors hover:cursor-pointer hover:bg-gray-100",
              {
                "bg-red-200 hover:bg-red-100": quot.status === "OPEN",
              }
            )}
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal w-32">
                {quot.challanNumber}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {quot.customer.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex hidden">
                {quot.causeOfChallan}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex hidden">
                {quot.status}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-40 lg:flex hidden">
                {format(quot.createdAt, "PP")}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-20 lg:flex hidden">
                {quot.ProductInChallan.length}
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
                        window.open(`/delivery-challan/view/${quot.id}`)
                      }
                    >
                      View Challan
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/delivery-challan/${quot.id}`)
                      }
                    >
                      Edit Challan
                    </DropdownMenuItem>
                    {quot.status === "OPEN" && (
                      <>
                        <DropdownMenuSeparator></DropdownMenuSeparator>
                        <DropdownMenuItem
                          onClick={async () => {
                            const response = await updateChallanStatusToClose(
                              quot.id
                            );

                            if (response?.success) {
                              router.refresh();
                              return toast({
                                title: `The delivery challan number ${quot.challanNumber} has been marked as closed.`,
                              });
                            }
                          }}
                        >
                          Mark as Close
                        </DropdownMenuItem>
                      </>
                    )}
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

export default ChallanTableBody;
