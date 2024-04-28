import { DataTable } from "@/components/Dashboard/Customers/data-table";
import { buttonVariants } from "@/components/ui/button";

import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { FC } from "react";
import { columns } from "../../../components/columns/columns";
import { Card, CardContent } from "@/components/ui/card";

const pacifico = Dancing_Script({ weight: ["400"], subsets: ["latin"] });

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const customers = await db.customer.findMany({
    select: {
      id: true,
      name: true,
      state: true,
      GST: true,
    },
  });

  let customerData: {
    id: string;
    name: string;
    state: string;
    GST: string;
  }[] = [];
  customers.map((cust) => {
    return customerData.push({
      name: cust.name,
      GST: cust.GST ? cust.GST : "",
      id: cust.id,
      state: cust.state,
    });
  });

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of customers</div>
        <Link
          href={"/dashboard/customers/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            <DataTable columns={columns} data={customerData}></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
