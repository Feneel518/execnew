import { PendingCustomerTable } from "@/lib/types";

import { FC } from "react";
import PendingOrderPage from "./PendingOrderPage";
import { getOrderDetailsForInvoice } from "@/lib/queries";
import { calculateRemainingQuantities } from "@/lib/utils";

interface PendingCustomerTableDataProps {
  order: PendingCustomerTable[];
}

const PendingCustomerTableData: FC<PendingCustomerTableDataProps> = async ({
  order,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-10 w-full ">
      {order.map(async (ord) => {
        const orderDetails = await getOrderDetailsForInvoice(ord.id);

        if (!orderDetails?.success || orderDetails.error) return;
        const acc = calculateRemainingQuantities(
          orderDetails.success,
          orderDetails.success.Invoice
        );
        return (
          <div className="w-full" key={ord.id}>
            <PendingOrderPage
              order={ord}
              remainingQuantity={acc}
            ></PendingOrderPage>
          </div>
        );
      })}
    </div>
  );
};

export default PendingCustomerTableData;
