import ChallanTableBody from "@/components/Dashboard/DeliveryChallan/ChallanTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { challanTable } from "@/lib/types";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {
  searchParams?: {
    query?: string;
    queryNumber?: string;
    page?: string;
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const queryNumber = searchParams?.queryNumber || "";
  const currentPage = Number(searchParams?.page || 1);
  let challan: challanTable[] = [];

  let totalPages: number = 0;

  if (query) {
    const challanCount = await db.deliveryChallan.count({
      where: {
        OR: [
          {
            customer: {
              slug: {
                contains: encodeURI(query?.toLowerCase()),
              },
            },
          },
        ],
      },
    });

    totalPages = Math.ceil(Number(challanCount) / 10);

    challan = await db.deliveryChallan.findMany({
      where: {
        OR: [
          {
            customer: {
              slug: {
                contains: encodeURI(query?.toLowerCase()),
              },
            },
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
          },
        },
        challanNumber: true,
        causeOfChallan: true,
        status: true,
        ProductInChallan: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else if (queryNumber) {
    const challanCount = await db.deliveryChallan.count({
      where: {
        OR: [
          {
            customer: {
              slug: {
                contains: encodeURI(query?.toLowerCase()),
              },
            },
          },
        ],
      },
    });

    totalPages = Math.ceil(Number(challanCount) / 10);

    challan = await db.deliveryChallan.findMany({
      where: {
        OR: [
          {
            challanNumber: Number(queryNumber),
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        causeOfChallan: true,
        status: true,
        customer: {
          select: {
            name: true,
          },
        },
        challanNumber: true,
        ProductInChallan: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const challanCount = await db.deliveryChallan.count({});

    challan = await db.deliveryChallan.findMany({
      select: {
        id: true,
        createdAt: true,
        causeOfChallan: true,
        status: true,
        customer: {
          select: {
            name: true,
          },
        },
        challanNumber: true,
        ProductInChallan: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        challanNumber: "desc",
      },
    });
    totalPages = Math.ceil(Number(challanCount) / 10);
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of Challan</div>
        <Link
          href={"/dashboard/delivery-challan/new"}
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
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-32">
                      Quotation Number
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Client
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
                      Status
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
                      Purpose
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
                      Date
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-20 lg:flex hidden">
                      No. Of Items
                    </h1>

                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={<ChallanTableBody challan={challan}></ChallanTableBody>}
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
