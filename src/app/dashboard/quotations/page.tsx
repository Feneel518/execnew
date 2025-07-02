import { DataTable } from "@/components/Dashboard/Customers/data-table";
import Quotation from "@/components/Dashboard/Quotations/Quotation";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Lora } from "next/font/google";
import Link from "next/link";
import { FC } from "react";
import { quotationColumn } from "../../../components/columns/quotationColumn";
import { format } from "date-fns";
import { Quotationtable } from "@/lib/types";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import QuotationTableBody from "@/components/Dashboard/Quotations/QuotationTableBody";
import TableToDisplay from "@/components/Global/TableToDisplay";

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
  let quotation: Quotationtable[] = [];

  let totalPages: number = 0;

  const quotationLength = await db.quotation.count();
  const archiveQuotationLength = await db.archivedQuotation.count();

  if (query) {
    const quotationCount = await db.quotation.count({
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
            ],
          },
          {
            archived: false,
          },
        ],
      },
    });

    totalPages = Math.ceil(Number(quotationCount) / 10);

    quotation = await db.quotation.findMany({
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
            ],
          },
          {
            archived: false,
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
        orderNumber: true,

        quotationNumber: true,
        ProductInQuotation: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else if (queryNumber) {
    const quotationCount = await db.quotation.count({
      where: {
        AND: [
          {
            archived: false,
          },

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

    totalPages = Math.ceil(Number(quotationCount) / 10);

    quotation = await db.quotation.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                quotationNumber: Number(queryNumber),
              },
            ],
          },
          {
            archived: false,
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
        orderNumber: true,

        quotationNumber: true,
        ProductInQuotation: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const quotationCount = await db.quotation.count({
      where: {
        archived: false,
      },
    });

    quotation = await db.quotation.findMany({
      where: {
        archived: false,
      },
      select: {
        orderNumber: true,
        id: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
          },
        },
        quotationNumber: true,
        ProductInQuotation: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        quotationNumber: "desc",
      },
    });
    totalPages = Math.ceil(Number(quotationCount) / 10);
  }
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of quotations</div>
        <Link
          href={"/dashboard/quotations/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            {/* <ProductsTable
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
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex ">
                      Order Number
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
              body={
                <QuotationTableBody quotation={quotation}></QuotationTableBody>
              }
            ></ProductsTable> */}
            <TableToDisplay
              totalPages={totalPages}
              columns={
                <div className="">
                  <div className="flex items-center border-b  p-4 max-lg:hidden">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-32">
                      Quotation Number
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Client
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex ">
                      Order Number
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
                </div>
              }
              body={
                <QuotationTableBody quotation={quotation}></QuotationTableBody>
              }
            ></TableToDisplay>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
