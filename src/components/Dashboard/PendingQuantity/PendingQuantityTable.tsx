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

  if (!productDetails?.success?.ProductInOrder) return;

  let pendingData:
    | {
        id: string;
        orderId: string;
        orderNumber: string;
        poNumber?: string | null;
        clientName: string;
        productName: string;
        productDescription: string | null;
        quantity: string;
      }[] = productDetails?.success?.ProductInOrder.map((pro) => {
    const acc = pro.ProductInInvoiceOfOrder.reduce((ac, item) => {
      return ac + item.supplidQuantity;
    }, 0);

    return {
      id: productDetails.success.id,
      clientName: pro.order.customer.name,
      orderId: pro.orderId,
      orderNumber: pro.order.orderNumber.toString(),
      productName: productDetails.success.name,
      quantity: (pro.quantity - acc).toString(),
      poNumber: pro.order.poNumber,
      productDescription: pro.description,
    };
  });

  const filteredPenidng = pendingData.filter(
    (item) => Number(item.quantity) > 0
  );

  const totalItem = productDetails?.success?.ProductInOrder.reduce((a, b) => {
    return (
      a +
      (b.quantity -
        b.ProductInInvoiceOfOrder.reduce((ac, item) => {
          return ac + item.supplidQuantity;
        }, 0))
    );
  }, 0);

  return (
    <div className="flex flex-col">
      <div className="mt-10">
        <h1>Pending Orders</h1>
        {/* {productDetails.success.ProductInOrder.map((order) => {
          return (
            <div className="">
              {order.order.customer.name} {order.order.orderNumber}{" "}
              {order.quantity}
            </div>
          );
        })} */}
        <Card>
          <CardContent>
            <DataTable
              columns={pendingColumns}
              data={filteredPenidng}
            ></DataTable>
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
