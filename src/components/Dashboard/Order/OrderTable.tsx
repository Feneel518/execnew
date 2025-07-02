import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ProductInOrderTable } from "@/lib/types";

interface OrderTableProps {
  products: ProductInOrderTable[];
  isWorkOrder?: boolean;
  remainingQuantity: { [x: string]: number };
}

const OrderTable: FC<OrderTableProps> = ({
  products,
  isWorkOrder,
  remainingQuantity,
}) => {
  return (
    <div>
      <Table className="md:inline-block hidden">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px]">Quantity</TableHead>
            {!isWorkOrder && (
              <TableHead className="text-right w-[100px]">Unit Price</TableHead>
            )}
            <TableHead className="text-right w-[50px]">
              Supplied Quantity
            </TableHead>
            <TableHead className="text-right w-[100px]">
              Pending Qantity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((invoice, index) => {
            return (
              <>
                <TableRow key={invoice.id} className="">
                  <TableCell className="font-medium">{invoice.index}</TableCell>
                  <TableCell>
                    <div className="">{invoice.product.name}</div>
                    <div className="">{invoice.description}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.quantity}
                  </TableCell>
                  {!isWorkOrder && (
                    <TableCell className="text-right">
                      {formatPrice(invoice.price)}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    {invoice.quantity - remainingQuantity[invoice.id]}
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    {remainingQuantity[invoice.id]}
                  </TableCell>
                </TableRow>
                <Separator></Separator>
              </>
            );
          })}
        </TableBody>
      </Table>
      <div className="md:hidden flex flex-col gap-8">
        {products.map((invoice, index) => {
          return (
            <div className="flex flex-col gap-2">
              <div className="">
                {index + 1} {invoice.product.name}
              </div>
              <div className="">{invoice.description}</div>
              <div className="flex gap-4">
                Quantity: {invoice.quantity}
                {!isWorkOrder && (
                  <div className=""> Price : {formatPrice(invoice.price)}</div>
                )}
                Pending Quantity: {remainingQuantity[invoice.id]}
              </div>
              <Separator></Separator>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTable;
