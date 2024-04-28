import { Card, CardContent } from "@/components/ui/card";
import { fetchPendingProductsQuantity } from "@/lib/queries";
import { FC } from "react";
import { DataTable } from "../Customers/data-table";
import { pendingColumns } from "./pendingColumn";

interface PendingQuantityTableProps {
  id: string | undefined;
}

const PendingQuantityTable: FC<PendingQuantityTableProps> = async ({ id }) => {
  if (!id) return;
  const productDetails = await fetchPendingProductsQuantity(id);

  console.log(
    productDetails?.success?.ProductInOrder.map(
      (pro) => pro.order.customer.name
    )
  );
  if (!productDetails?.success?.ProductInOrder) return;

  let pendingData:
    | {
        id: string;
        orderId: string;
        orderNumber: string;
        poNumber?: string | null;
        clientName: string;
        productName: string;
        quantity: string;
      }[] = productDetails?.success?.ProductInOrder.map((pro) => {
    return {
      id: productDetails.success.id,
      clientName: pro.order.customer.name,
      orderId: pro.orderId,
      orderNumber: pro.order.orderNumber.toString(),
      productName: productDetails.success.name,
      quantity: pro.quantity.toString(),
      poNumber: pro.order.poNumber,
    };
  });

  const totalItem = productDetails?.success?.ProductInOrder.reduce((a, b) => {
    return a + b.quantity;
  }, 0);

  console.log(totalItem);

  return (
    <div className="flex flex-col">
      <div className="mt-10">
        <h1>Completed Orders</h1>
        <Card>
          <CardContent>
            <DataTable columns={pendingColumns} data={pendingData}></DataTable>
          </CardContent>
        </Card>
        <Card className="mt-10">
          <CardContent className="flex items-center justify-end p-4">
            <div className="text-3xl">Total : {totalItem}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingQuantityTable;
