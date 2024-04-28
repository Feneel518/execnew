import { DataTable } from "@/components/Dashboard/Customers/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";
import { FC } from "react";
import { categoriesColumns } from "../../../components/columns/categoriesColumns";

const pacifico = Dancing_Script({ weight: ["400"], subsets: ["latin"] });

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const categories = await db.category.findMany({
    select: {
      slug: true,
      name: true,
    },
  });
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="">List of categories</div>
        <Link
          href={"/dashboard/categories/new"}
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
              columns={categoriesColumns}
              data={categories}
            ></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
