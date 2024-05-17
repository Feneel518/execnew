import { DataTable } from "@/components/Dashboard/Customers/data-table";
import StoreProductsColumn from "@/components/columns/StoreProductsColumn";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const products = await db.storeProduct.findMany({
    select: {
      name: true,
      StoreProductId: true,
      slug: true,
    },
  });

  console.log(products);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of store products</div>
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
            <DataTable
              columns={StoreProductsColumn}
              data={products}
            ></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
