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

interface AluminumClientTableBodyProps {
  customer: {
    id?: string;
    name?: string;
    type?: string;
    GST?: string | null | undefined;
  }[];
}

const AluminumClientTableBody: FC<AluminumClientTableBodyProps> = ({
  customer,
}) => {
  const router = useRouter();
  return (
    <div>
      {customer.map((cust) => {
        return (
          <div
            key={cust.id}
            className="border-b transition-colors hover:bg-muted/50 "
          >
            <div className=" px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {cust.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-40 lg:flex hidden">
                {cust.type}
              </div>
              <div className="p-4 align-middle text-sm font-normal w-60 lg:flex hidden">
                {cust.GST}
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
                        navigator.clipboard.writeText(cust?.id as string)
                      }
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/aluminum/clients/${cust.id}`)
                      }
                    >
                      {" "}
                      View Customer
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

export default AluminumClientTableBody;
