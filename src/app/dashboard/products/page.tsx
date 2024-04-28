import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { FC } from "react";
import { productsColumns } from "../../../components/columns/productsColumns";
import { DataTable } from "@/components/Dashboard/Customers/data-table";

interface pageProps {}
const pacifico = Dancing_Script({ weight: ["400"], subsets: ["latin"] });

const page: FC<pageProps> = async ({}) => {
  const products = await db.product.findMany({
    select: {
      slug: true,
      name: true,
    },
  });
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of products</div>
        <Link
          href={"/dashboard/products/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardContent>
            <DataTable columns={productsColumns} data={products}></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
