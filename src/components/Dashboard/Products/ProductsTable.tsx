"use client";

import CustomPagination from "@/components/Global/Pagination";
import Search from "@/components/Global/Search";
import { FC, JSXElementConstructor } from "react";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  totalPages: number;
  columns: React.ReactNode;
  body: React.ReactNode;
}

const ProductsTable: FC<ProductsTableProps> = ({
  totalPages,
  columns,
  body,
}) => {
  return (
    <div className="py-4 lg:p-8 flex flex-col gap-8">
      <Search></Search>
      <div className="border rounded-md ">
        {columns}
        {body}
      </div>
      <CustomPagination totalPages={totalPages}></CustomPagination>
    </div>
  );
};

export default ProductsTable;
