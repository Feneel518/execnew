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

interface CastingsTableBodyProps {
  castings: {
    name: string;
    weight: number | null;
    slug: string;
    id: string;
  }[];
}

const CastingsTableBody: FC<CastingsTableBodyProps> = ({ castings }) => {
  const router = useRouter();
  return (
    <div>
      {castings.map((cate) => {
        return (
          <div
            key={cate.slug}
            className="border-b transition-colors hover:bg-muted/50 "
          >
            <div className=" px-4 text-left align-middle font-medium grid grid-cols-3 items-center     ">
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {cate.name}
              </div>
              <div className="p-4 align-middle text-sm font-normal flex-1">
                {cate.weight}
              </div>
              <div className="p-4 align-middle text-sm font-normal lg:w-80">
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
                        router.push(`/aluminum/products/${cate.id}`)
                      }
                    >
                      {" "}
                      Edit Casting
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

export default CastingsTableBody;
