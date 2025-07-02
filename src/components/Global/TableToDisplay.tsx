"use client";

import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import Search from "./Search";
import SearchNumber from "./SearchNumber";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import CustomPagination from "./Pagination";

interface TableToDisplayProps {
  products?: {
    name: string;
    slug: string;
  }[];
  categories?: {
    name: string;
    slug: string;
  }[];
  customers?: {
    id?: string;
    name?: string;
    state?: string;
    GST?: string | null | undefined;
  }[];
  employees?: {
    id?: string;
    name?: string;
    slug?: string;
  }[];
  totalPages?: number;
  columns: React.ReactNode;
  body: React.ReactNode;
  sort?: boolean;
}

const TableToDisplay: FC<TableToDisplayProps> = ({
  totalPages,
  columns,
  body,
  sort,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams();
    params.set("sort", filter);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="py-4 lg:p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center  gap-4">
          {pathname.includes("stock") ? null : <Search></Search>}
          {pathname.includes("orders") || pathname.includes("quotations") ? (
            <SearchNumber></SearchNumber>
          ) : null}
        </div>
        {sort ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="">
                <span className="sr-only">Open menu</span>
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div className="border rounded-md ">
        {columns}
        {body}
      </div>
      {pathname.includes("stock") ? null : (
        <CustomPagination totalPages={totalPages}></CustomPagination>
      )}
    </div>
  );
};

export default TableToDisplay;
