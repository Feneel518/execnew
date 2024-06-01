"use client";

import CustomPagination from "@/components/Global/Pagination";
import Search from "@/components/Global/Search";
import { FC, JSXElementConstructor } from "react";

import { MoreHorizontal } from "lucide-react";
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
}

const ProductsTable: FC<ProductsTableProps> = ({
  totalPages,
  columns,
  body,
  sort,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", filter);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="py-4 lg:p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Search></Search>
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
                {" "}
                Show all
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleFilter("pending")}>
                {" "}
                Fiter pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("completed")}>
                {" "}
                Fiter completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div className="border rounded-md ">
        {columns}
        {body}
      </div>
      <CustomPagination totalPages={totalPages}></CustomPagination>
    </div>
  );
};

export default ProductsTable;
