import { fetchPendingCustomerProductsQuantity } from "@/lib/queries";
import { FC } from "react";

interface PendingCustomerTableProps {
  id: string | undefined;
}

const PendingCustomerTable: FC<PendingCustomerTableProps> = async ({ id }) => {
  if (!id) return;

  const productDetails = await fetchPendingCustomerProductsQuantity(id);

  if (!productDetails?.success || productDetails.error) return;

  console.log(productDetails.success);

  return (
    <div>
      {productDetails.success.map((order) => {
        return (
          <div className="">
            {order.orderNumber} {order.poNumber}
          </div>
        );
      })}
    </div>
  );
};

export default PendingCustomerTable;
