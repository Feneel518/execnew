import { Card, CardContent } from "@/components/ui/card";

import {
  fetchPendingCustomerProductsQuantity,
  getOrderDetailsForInvoice,
} from "@/lib/queries";

import { FC } from "react";
import PendingCustomerTableData from "./PendingCustomerTableData";
import { calculateRemainingQuantities } from "@/lib/utils";

interface PendingCustomerTableProps {
  id: string | undefined;
}

const PendingCustomerTable: FC<PendingCustomerTableProps> = async ({ id }) => {
  if (!id) return;

  const productDetails = await fetchPendingCustomerProductsQuantity(id);

  if (!productDetails?.success || productDetails.error) return;

  return (
    <div className="mt-10">
      <PendingCustomerTableData
        order={productDetails.success}
      ></PendingCustomerTableData>
    </div>

    // {/* <div className="flex items-center border-b  p-4 justify-between print:hidden">
    //   <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-32">
    //     Order Number
    //   </h1>
    //   <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground flex-1">
    //     Product Name
    //   </h1>
    //   <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground w-60">
    //     PO Number
    //   </h1>
    //   <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
    //     PO Date
    //   </h1>
    //   <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40 lg:flex hidden">
    //     Status
    //   </h1>

    //   <h1 className=" px-4 text-left align-middle font-medium text-muted-foreground lg:w-40">
    //     Actions
    //   </h1>
    // </div> */}
  );
};

export default PendingCustomerTable;
