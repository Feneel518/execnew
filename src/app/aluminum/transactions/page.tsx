import { buttonVariants } from "@/components/ui/button";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="text-3xl">List of Transactions</div>
        <Link
          href={"/aluminum/transactions/new"}
          className={clsx(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <Plus></Plus>
          <span>New</span>
        </Link>
      </div>
      {/* <div className="mt-4">
    <Card>
      <CardContent>
        <ProductsTable
          totalPages={totalPages}
          columns={
            <>
              <div className="flex items-center border-b  p-4 ">
                <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                  Name
                </h1>
                <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1 lg:flex hidden">
                  Status
                </h1>
                <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                  Employee
                </h1>
                <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1 lg:flex hidden">
                  Quantity
                </h1>
                <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
                  date
                </h1>
                <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
                  Actions
                </h1>
              </div>
            </>
          }
          body={
            <InventoryTableBody inventory={inventory}></InventoryTableBody>
          }
        ></ProductsTable>
      </CardContent>
    </Card>
  </div> */}
    </div>
  );
};

export default page;
