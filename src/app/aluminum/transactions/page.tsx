import TransactionTableBody from "@/components/aluminum/TransactionTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { TransactionTable } from "@/lib/types";
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
  let transaction: TransactionTable[] = [];

  let totalPages: number = 0;

  if (query) {
    const transactionCount = await db.aluminumTransaction.count({
      where: {
        OR: [
          {
            supplier: {
              slug: {
                contains: encodeURI(query?.toLowerCase()),
                mode: "insensitive",
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    totalPages = Math.ceil(Number(transactionCount) / 10);

    transaction = await db.aluminumTransaction.findMany({
      where: {
        OR: [
          {
            supplier: {
              slug: {
                contains: encodeURI(query?.toLowerCase()),
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
        id: true,
        inwardType: true,
        supplier: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        weight: true,
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const invoiceCount = await db.aluminumTransaction.count({});

    transaction = await db.aluminumTransaction.findMany({
      select: {
        id: true,
        inwardType: true,
        supplier: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        weight: true,
        createdAt: true,
        status: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    totalPages = Math.ceil(Number(invoiceCount) / 10);
  }
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of Transactions</div>
        <Link
          href={"/aluminum/transactions/new"}
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
                  <div className="grid grid-cols-7 items-center border-b  p-4 max-lg:hidden ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1 ">
                      Status
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1 ">
                      type
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Supplier
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      User
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Weight
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      date
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                // <InventoryTableBody inventory={inventory}></InventoryTableBody>
                <TransactionTableBody
                  transaction={transaction}
                ></TransactionTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
