import { DataTable } from "@/components/Dashboard/Customers/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { FC } from "react";
import { categoriesColumns } from "../../../components/columns/categoriesColumns";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import CategoriesTableBody from "@/components/Dashboard/Categories/CategoriesTableBody";

const pacifico = Dancing_Script({ weight: ["400"], subsets: ["latin"] });

interface pageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page || 1);
  let categories: {
    slug: string;
    name: string;
  }[] = [];

  let totalPages: number = 0;

  if (query) {
    const categoriesCount = await db.category.count({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
    });

    totalPages = Math.ceil(Number(categoriesCount) / 10);

    categories = await db.category.findMany({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const categoriesCount = await db.category.count({});

    categories = await db.category.findMany({
      select: {
        slug: true,
        name: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        name: "asc",
      },
    });
    totalPages = Math.ceil(Number(categoriesCount) / 10);
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of categories</div>
        <Link
          href={"/dashboard/categories/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>

      <div className="mt-4">
        <Card>
          <CardContent>
            <ProductsTable
              categories={categories}
              totalPages={totalPages}
              columns={
                <>
                  <div className="flex items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Name
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-80">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                <CategoriesTableBody
                  categories={categories}
                ></CategoriesTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
