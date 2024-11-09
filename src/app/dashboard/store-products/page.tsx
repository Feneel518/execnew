import { DataTable } from "@/components/Dashboard/Customers/data-table";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import ProductTableBody from "@/components/Dashboard/StoreProduct/ProductTableBody";
import StoreProductsColumn from "@/components/columns/StoreProductsColumn";
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
  // const products = await db.storeProduct.findMany({
  //   select: {
  //     name: true,
  //     StoreProductId: true,
  //     slug: true,
  //   },
  // });

  const query = searchParams?.query || "";

  const currentPage = Number(searchParams?.page || 1);

  let product: { StoreProductId: string; name: string; slug: string }[] = [];

  let totalPages: number = 0;

  if (query) {
    const productCount = await db.storeProduct.count({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase()),
        },
      },
    });

    totalPages = Math.ceil(Number(productCount) / 10);

    product = await db.storeProduct.findMany({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase()),
        },
      },
      select: {
        name: true,
        StoreProductId: true,
        slug: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const productCount = await db.storeProduct.count({});

    product = await db.storeProduct.findMany({
      select: {
        name: true,
        StoreProductId: true,
        slug: true,
      },
      take: 10,
      skip: ((currentPage ? currentPage : 1) - 1) * 10,
      orderBy: {
        StoreProductId: "desc",
      },
    });
    totalPages = Math.ceil(Number(productCount) / 10);
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of store products</div>
        <Link
          href={"/dashboard/store-products/new"}
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
                  <div className="flex items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Name
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Store Id
                    </h1>

                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                <ProductTableBody
                  product={product}
                  page={searchParams?.page}
                  search={searchParams?.query}
                ></ProductTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
