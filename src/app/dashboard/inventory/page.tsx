import InventoryForm from "@/components/Dashboard/Inventory/InventoryForm";
import InventoryTableBody from "@/components/Dashboard/Inventory/InventoryTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getInventoryData } from "@/lib/queries";
import { InventoryTable } from "@/lib/types";
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

  let inventory: InventoryTable[] = [];
  let totalPages = 0;

  if (query) {
    const inventoryCount = await db.inventory.count({
      where: {
        OR: [
          {
            storeProduct: {
              slug: {
                contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    totalPages = Math.ceil(Number(inventoryCount) / 10);

    inventory = await db.inventory.findMany({
      where: {
        OR: [
          {
            storeProduct: {
              slug: {
                contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
              },
            },
          },
        ],
      },
      select: {
        id: true,
        employee: {
          select: {
            name: true,
          },
        },
        quantity: true,
        storeProduct: true,
        status: true,
        createdAt: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (query === "") {
    const inventoryCount = await db.inventory.count({});

    const response = await getInventoryData(currentPage);

    if (response?.error || !response?.success || !response) return null;

    inventory = response.success;

    totalPages = Math.ceil(Number(inventoryCount) / 10);
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of Inventories</div>
        <Link
          href={"/dashboard/inventory/new"}
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
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1 lg:flex hidden">
                      Status
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Employee
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1 lg:flex hidden">
                      Quantity
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
                <InventoryTableBody inventory={inventory}></InventoryTableBody>
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
