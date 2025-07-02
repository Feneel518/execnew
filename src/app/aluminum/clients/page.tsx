import { buttonVariants } from "@/components/ui/button";

import AluminumClientTableBody from "@/components/aluminum/AluminumClientTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
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
  let customer: {
    id?: string;
    name?: string;
    type?: string;
    GST?: string | null | undefined;
  }[] = [];

  let totalPages: number = 0;

  if (query) {
    const customersCount = await db.aluminumClient.count({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
    });

    totalPages = Math.ceil(Number(customersCount) / 10);

    customer = await db.aluminumClient.findMany({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        GST: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const customersCount = await db.aluminumClient.count({});

    customer = await db.aluminumClient.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        GST: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        name: "asc",
      },
    });
    totalPages = Math.ceil(Number(customersCount) / 10);
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of Aluminum Users</div>
        <Link
          href={"/aluminum/clients/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            {/* <DataTable columns={columns} data={customerData}></DataTable> */}
            <ProductsTable
              customers={customer}
              totalPages={totalPages}
              columns={
                <>
                  <div className="flex items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Name
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-40 lg:flex hidden">
                      Type
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-60 lg:flex hidden">
                      GST
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                <AluminumClientTableBody
                  customer={customer}
                ></AluminumClientTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
