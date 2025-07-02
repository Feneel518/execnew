"use client";

import CustomPagination from "@/components/Global/Pagination";
import Search from "@/components/Global/Search";
import { FC, JSXElementConstructor } from "react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchNumber from "@/components/Global/SearchNumber";
import { cn } from "@/lib/utils";
interface ProductsTableProps {
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
  className?: string;
}

const ProductsTable: FC<ProductsTableProps> = ({
  totalPages,
  columns,
  body,
  sort,
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams();
    params.set("sort", filter);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("py-4 lg:p-8 flex flex-col gap-8", className)}>
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

export default ProductsTable;
