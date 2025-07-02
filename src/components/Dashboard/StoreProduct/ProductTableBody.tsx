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

interface ProductTableBodyProps {
  product: {
    name: string;
    StoreProductId: string;
    slug: string;
  }[];
  page?: string;
  search?: string;
}

const ProductTableBody: FC<ProductTableBodyProps> = ({
  product,
  page,
  search,
}) => {
  const router = useRouter();
  return (
    <div>
      {product.map((quot) => {
        return (
          <div
            key={quot.slug}
            className="border-b transition-colors hover:bg-muted/50 "
          >
            <div className="px-4 text-left align-middle font-medium flex items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {quot.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {quot.StoreProductId}
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
                      onClick={() => navigator.clipboard.writeText(quot.slug)}
                    >
                      Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/dashboard/store-products/${quot.slug}?page=${page}${
                            search === undefined ? `` : `&query=${search}`
                          }`
                        )
                      }
                    >
                      Edit Store Product
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

export default ProductTableBody;
