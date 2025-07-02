import { PendingCustomerTable } from "@/lib/types";
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
import { format } from "date-fns";

interface CustomerPendingProps {
  products: PendingCustomerTable[];
}

const CustomerPending: FC<CustomerPendingProps> = ({ products }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Order Number</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px]">PO Number</TableHead>

            <TableHead className="text-right w-[50px]">Po Date</TableHead>
            <TableHead className="text-right w-[100px]">Status</TableHead>
            <TableHead className="text-right w-[100px] print:hidden">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((invoice, index) => {
            return (
              <>
                <TableRow key={invoice.id} className="">
                  <TableCell className="font-medium">
                    {invoice.orderNumber}
                  </TableCell>
                  <TableCell>
                    {invoice.ProductInOrder.map((prod) => {
                      return (
                        <div className="grid grid-cols-3 gap-2">
                          <p>{prod.product.name}</p>
                          <p>{prod.description}</p>
                          <p>{prod.quantity}</p>
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.poNumber}
                  </TableCell>

                  <TableCell className="text-right">
                    {format(invoice.poDate as Date, "PP")}
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    {invoice.status}
                  </TableCell>
                </TableRow>
                <Separator></Separator>
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerPending;
