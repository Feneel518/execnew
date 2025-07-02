import { FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

interface PaginationProps {
  totalPages?: number;
}

const CustomPagination: FC<PaginationProps> = ({ totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const router = useRouter();

  const createPageUrl = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex lg:flex-row flex-col items-center gap-8 justify-between">
      <div className="flex items-center gap-8 text-sm">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-8">
        <Button
          disabled={page <= 1}
          onClick={() => {
            createPageUrl(page - 1);
          }}
          variant={"ghost"}
          className="flex items-center"
        >
          <ChevronLeft size={18}></ChevronLeft> Previous
        </Button>
        <div className="-mx-6 flex items-center gap-2">
          {totalPages! >= 1 && (
            <Button
              onClick={() => {
                createPageUrl(1);
              }}
              variant={"ghost"}
              className="flex items-center border"
            >
              1
            </Button>
          )}
          {totalPages! >= 2 && (
            <Button
              onClick={() => {
                createPageUrl(2);
              }}
              variant={"ghost"}
              className="flex items-center border"
            >
              2
            </Button>
          )}
          {totalPages! > 2 && <MoreHorizontal className="h-4 w-4" />}
          {totalPages! > 2 && (
            <Button
              onClick={() => {
                createPageUrl(totalPages!);
              }}
              variant={"ghost"}
              className="flex items-center border"
            >
              {totalPages}
            </Button>
          )}
        </div>
        <Button
          disabled={page >= totalPages!}
          onClick={() => {
            createPageUrl(page + 1);
          }}
          variant={"ghost"}
          className="flex items-center"
        >
          Next <ChevronRight size={18}></ChevronRight>
        </Button>
      </div>
    </div>
  );
};

export default CustomPagination;
