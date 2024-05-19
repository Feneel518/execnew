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

interface EmployeeTableBodyProps {
  employee: {
    id?: string;
    name?: string;
    slug?: string;
  }[];
}

const EmployeeTableBody: FC<EmployeeTableBodyProps> = ({ employee }) => {
  const router = useRouter();
  return (
    <div>
      {employee.map((empl) => {
        return (
          <div
            key={empl.id}
            className="border-b transition-colors hover:bg-muted/50 "
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {empl.name}
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
                        navigator.clipboard.writeText(empl.slug as string)
                      }
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/employees/${empl.slug}`)
                      }
                    >
                      {" "}
                      View Employee
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

export default EmployeeTableBody;
