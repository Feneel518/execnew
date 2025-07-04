import { DataTable } from "@/components/Dashboard/Customers/data-table";
import InvoiceTableBody from "@/components/Dashboard/Invoice/InvoiceTableBody";
import OrderTableBody from "@/components/Dashboard/Orders/OrderTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import NoResults from "@/components/Global/NoResults";
import { ordersColumns } from "@/components/columns/ordersColumns";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { InvoiceTable, OrderColumns, OrderTable } from "@/lib/types";

import clsx from "clsx";
import { format } from "date-fns";
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
  let invoices: InvoiceTable[] = [];

  let totalPages: number = 0;

  if (query) {
    const invoiceCount = await db.invoice.count({
      where: {
        OR: [
          {
            order: {
              customer: {
                slug: {
                  contains: encodeURI(query?.toLowerCase()),
                  mode: "insensitive",
                },
              },
            },
          },
          {
            invoiceNumber: {
              mode: "insensitive",
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    totalPages = Math.ceil(Number(invoiceCount) / 10);

    invoices = await db.invoice.findMany({
      where: {
        OR: [
          {
            order: {
              customer: {
                slug: {
                  contains: encodeURI(query?.toLowerCase()),
                },
              },
            },
          },
          {
            invoiceNumber: {
              mode: "insensitive",
              contains: query,
            },
          },
        ],
      },
      select: {
        id: true,
        invoiceNumber: true,
        invoiceDate: true,
        LrNumber: true,
        LrUrl: true,
        transportName: true,
        order: {
          select: {
            id: true,
            poNumber: true,
            poDate: true,
            orderNumber: true,
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        ProductInInvoiceOfOrder: {
          select: {
            id: true,
            certificateNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const invoiceCount = await db.invoice.count({});

    invoices = await db.invoice.findMany({
      select: {
        id: true,
        invoiceNumber: true,
        invoiceDate: true,
        LrNumber: true,
        LrUrl: true,
        transportName: true,
        order: {
          select: {
            id: true,
            poNumber: true,
            poDate: true,
            orderNumber: true,
            customer: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        ProductInInvoiceOfOrder: {
          select: {
            id: true,
            certificateNumber: true,
          },
        },
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
        <div className="text-3xl">List of invoices</div>
        <Link
          href={"/dashboard/invoice/new"}
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
              sort={true}
              columns={
                <>
                  <div className="flex items-center border-b  p-4 justify-between">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-32">
                      Invoice Number
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
                      Order Number
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
                invoices.length > 0 ? (
                  // <OrderTableBody invoices={invoices}></OrderTableBody>
                  <InvoiceTableBody invoice={invoices}></InvoiceTableBody>
                ) : (
                  // <div className=""></div>
                  <NoResults></NoResults>
                )
              }
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
