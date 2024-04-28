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

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const quotation = await db.quotation.findMany({
    select: {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const quotationData = quotation.map((item) => {
    return {
      quotationNumber: item.quotationNumber.toString().padStart(4, "0"),
      clientName: item.customer.name ? item.customer.name : "",
      itemsLength: item.ProductInQuotation.length,
      id: item.id,
      createdAt: format(item.createdAt, "PP"),
    };
  });
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of quotations</div>
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
            <DataTable
              columns={quotationColumn}
              data={quotationData}
              isQuotation={true}
            ></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
