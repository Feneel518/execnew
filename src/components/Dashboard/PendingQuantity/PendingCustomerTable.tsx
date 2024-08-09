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
      {productDetails.success ? (
        <PendingCustomerTableData
          order={productDetails.success}
        ></PendingCustomerTableData>
      ) : (
        <div className="">Loading...</div>
      )}
    </div>
  );
};

export default PendingCustomerTable;
