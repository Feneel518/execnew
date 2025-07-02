import { DataTable } from "@/components/Dashboard/Customers/data-table";
import OrderTableBody from "@/components/Dashboard/Orders/OrderTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import NoResults from "@/components/Global/NoResults";
import TableToDisplay from "@/components/Global/TableToDisplay";
import { ordersColumns } from "@/components/columns/ordersColumns";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { OrderColumns, OrderTable } from "@/lib/types";

import clsx from "clsx";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {
  searchParams?: {
    query?: string;
    queryNumber?: string;
    page?: string;
    sort?: "all" | "pending" | "completed";
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  const query = searchParams?.query || "";
  const queryNumber = searchParams?.queryNumber || "";
  const currentPage = Number(searchParams?.page || 1);
  const sortStatus = searchParams?.sort || "all";
  let orders: OrderTable[] = [];

  let totalPages: number = 0;

  if (query) {
    if (sortStatus === "all") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumber: {
                    contains: encodeURI(query?.toLowerCase()),
                  },
                },
              ],
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPages = Math.ceil(Number(orderCount) / 10);

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumberSlug: {
                    contains: encodeURI(
                      query?.toLowerCase().replace(/\//g, "-")
                    ),
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          status: true,
          orderPDFFile: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (currentPage - 1) * 10,
      });
    }
    if (sortStatus === "pending") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumberSlug: {
                    contains: encodeURI(
                      query?.toLowerCase().replace(/\//g, "-")
                    ),
                  },
                },
              ],
            },
            {
              status: {
                not: "COMPLETED",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPages = Math.ceil(Number(orderCount) / 10);

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumberSlug: {
                    contains: encodeURI(
                      query?.toLowerCase().replace(/\//g, "-")
                    ),
                  },
                },
              ],
            },
            {
              status: {
                not: "COMPLETED",
              },
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          status: true,
          orderPDFFile: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (currentPage - 1) * 10,
      });
    }
    if (sortStatus === "completed") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumberSlug: {
                    contains: encodeURI(
                      query?.toLowerCase().replace(/\//g, "-")
                    ),
                  },
                },
              ],
            },
            {
              status: {
                equals: "COMPLETED",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPages = Math.ceil(Number(orderCount) / 10);

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumberSlug: {
                    contains: encodeURI(
                      query?.toLowerCase().replace(/\//g, "-")
                    ),
                  },
                },
                {
                  orderNumber: {
                    gte: Number(query) && Number(query),
                  },
                },
              ],
            },
            {
              status: "COMPLETED",
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          status: true,
          orderPDFFile: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (currentPage - 1) * 10,
      });
    }
  } else if (queryNumber) {
    if (sortStatus === "all") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              OR: [
                {
                  orderNumber: Number(queryNumber),
                },
              ],
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPages = Math.ceil(Number(orderCount) / 10);

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  orderNumber: Number(queryNumber),
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          orderPDFFile: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (currentPage - 1) * 10,
      });
    }
    if (sortStatus === "pending") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              OR: [
                {
                  orderNumber: Number(queryNumber),
                },
              ],
            },
            {
              status: {
                not: "COMPLETED",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPages = Math.ceil(Number(orderCount) / 10);

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  orderNumber: Number(queryNumber),
                },
              ],
            },
            {
              status: {
                not: "COMPLETED",
              },
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          orderPDFFile: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (currentPage - 1) * 10,
      });
    }
    if (sortStatus === "completed") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              OR: [
                {
                  orderNumber: Number(queryNumber),
                },
              ],
            },
            {
              status: {
                equals: "COMPLETED",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      totalPages = Math.ceil(Number(orderCount) / 10);

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  customer: {
                    slug: {
                      contains: encodeURI(query?.toLowerCase()),
                    },
                  },
                },
                {
                  poNumberSlug: {
                    contains: encodeURI(
                      query?.toLowerCase().replace(/\//g, "-")
                    ),
                  },
                },
                {
                  orderNumber: {
                    gte: Number(query) && Number(query),
                  },
                },
              ],
            },
            {
              status: "COMPLETED",
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          orderPDFFile: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: (currentPage - 1) * 10,
      });
    }
  } else {
    if (sortStatus === "all") {
      const orderCount = await db.order.count({});

      orders = await db.order.findMany({
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          orderPDFFile: true,
          poDate: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
              quantity: true,
              supplied: true,
            },
          },
        },
        take: 10,
        skip: (currentPage - 1) * 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      totalPages = Math.ceil(Number(orderCount) / 10);
    }
    if (sortStatus === "pending") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              status: {
                not: "COMPLETED",
              },
            },
          ],
        },
      });

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              status: {
                not: "COMPLETED",
              },
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          orderPDFFile: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
              quantity: true,
              supplied: true,
            },
          },
        },
        take: 10,
        skip: (currentPage - 1) * 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      totalPages = Math.ceil(Number(orderCount) / 10);
    }
    if (sortStatus === "completed") {
      const orderCount = await db.order.count({
        where: {
          AND: [
            {
              status: {
                equals: "COMPLETED",
              },
            },
          ],
        },
      });

      orders = await db.order.findMany({
        where: {
          AND: [
            {
              status: "COMPLETED",
            },
          ],
        },
        select: {
          id: true,
          orderNumber: true,
          poNumber: true,
          poDate: true,
          orderPDFFile: true,
          status: true,
          customer: {
            select: {
              name: true,
            },
          },
          ProductInOrder: {
            select: {
              id: true,
              quantity: true,
              supplied: true,
            },
          },
        },
        take: 10,
        skip: (currentPage - 1) * 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      totalPages = Math.ceil(Number(orderCount) / 10);
    }
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of Orders</div>
        <Link
          href={"/dashboard/orders/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            <TableToDisplay
              totalPages={totalPages}
              sort={true}
              columns={
                <>
                  <div className="flex items-center border-b  p-4 justify-between max-lg:hidden">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-32">
                      Order Number
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Client
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-60">
                      PO Number
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
                      PO Date
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
                      Status
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-20 lg:flex hidden">
                      No. of Items
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                orders.length > 0 ? (
                  <OrderTableBody orders={orders}></OrderTableBody>
                ) : (
                  <NoResults></NoResults>
                )
              }
            ></TableToDisplay>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
