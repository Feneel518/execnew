import EmployeeTableBody from "@/components/Dashboard/Employees/EmployeeTableBody";
import ProductsTable from "@/components/Dashboard/Products/ProductsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
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
  let employee: {
    id?: string;
    name?: string;
    slug?: string;
  }[] = [];

  let totalPages: number = 0;

  if (query) {
    const employeeCount = await db.employee.count({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
    });

    totalPages = Math.ceil(Number(employeeCount) / 10);

    employee = await db.employee.findMany({
      where: {
        slug: {
          contains: encodeURI(query?.toLowerCase().replace(/\//g, "-")),
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
    });
  } else {
    const employeeCount = await db.employee.count({});

    employee = await db.employee.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 10,
      skip: (currentPage - 1) * 10,
      orderBy: {
        name: "asc",
      },
    });
    totalPages = Math.ceil(Number(employeeCount) / 10);
  }
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of employees</div>
        <Link
          href={"/dashboard/employees/new"}
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
              employees={employee}
              totalPages={totalPages}
              columns={
                <>
                  <div className="flex items-center border-b  p-4 ">
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                      Name
                    </h1>
                    <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                      Actions
                    </h1>
                  </div>
                </>
              }
              body={<EmployeeTableBody employee={employee}></EmployeeTableBody>}
            ></ProductsTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
