import InvoiceTableBody from "@/components/Dashboard/Invoice/InvoiceTableBody";
import PerformaInvoiceBody from "@/components/Dashboard/Perfoma/PerformaInvoiceBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import NoResults from "@/components/Global/NoResults";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { PerfomaInvoiceTable } from "@/lib/types";
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
  let invoices: PerfomaInvoiceTable[] = [];

  let totalPages: number = 0;

  if (query) {
    const invoiceCount = await db.perfomaInvoice.count({
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
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    totalPages = Math.ceil(Number(invoiceCount) / 10);

    invoices = await db.perfomaInvoice.findMany({
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
        ],
      },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        ProductInPerfomaInvoiceOfOrder: {
          include: {
            ProductInOrder: {
              include: {
                product: true,
              },
            },
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
    const invoiceCount = await db.perfomaInvoice.count({});

    invoices = await db.perfomaInvoice.findMany({
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        ProductInPerfomaInvoiceOfOrder: {
          include: {
            ProductInOrder: {
              include: {
                product: true,
              },
            },
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
          href={"/dashboard/perfoma/new"}
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
                      P.I. Number
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
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
                      Status
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-20 lg:flex hidden">
                      Amount
                    </h1>
                    <h1 className=" px-4 text-right align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={
                invoices.length > 0 ? (
                  <PerformaInvoiceBody invoice={invoices}></PerformaInvoiceBody>
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
