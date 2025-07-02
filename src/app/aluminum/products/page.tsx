import CastingsTableBody from "@/components/aluminum/CastingsTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page || 1);
  let castings: {
    slug: string;
    name: string;
    weight: number | null;
    id: string;
  }[] = [];

  let totalPages: number = 0;

  if (query) {
    const productsCount = await db.castings.count({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
    });

    totalPages = Math.ceil(Number(productsCount) / 10);

    castings = await db.castings.findMany({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const productsCount = await db.castings.count({});

    castings = await db.castings.findMany({
      select: {
        slug: true,
        name: true,
        weight: true,
        id: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        name: "asc",
      },
    });
    totalPages = Math.ceil(Number(productsCount) / 10);
  }
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of Products</div>
        <Link
          href={"/aluminum/products/new"}
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
              totalPages={totalPages}
              columns={
                <>
                  <div className="grid grid-cols-3 items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Name
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Weight
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-80">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                <CastingsTableBody castings={castings}></CastingsTableBody>
                // <CategoriesTableBody
                //   categories={categories}
                // ></CategoriesTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
