import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import ProductTableBody from "@/components/Dashboard/Products/ProducttableBody";

interface pageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page || 1);
  let products: {
    slug: string;
    name: string;
  }[] = [];

  let totalPages: number = 0;

  if (query) {
    const productCount = await db.product.count({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
    });

    totalPages = Math.ceil(Number(productCount) / 10);

    products = await db.product.findMany({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const productCount = await db.product.count({});

    products = await db.product.findMany({
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
    totalPages = Math.ceil(Number(productCount) / 10);
  }
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of products</div>
        <Link
          href={"/dashboard/products/new"}
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
              products={products}
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
              body={<ProductTableBody products={products}></ProductTableBody>}
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
