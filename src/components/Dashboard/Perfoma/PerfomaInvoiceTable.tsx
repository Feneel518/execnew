"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductInPerfomaInvoiceTable } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PerfomaInvoiceTableProps {
  products: ProductInPerfomaInvoiceTable[];
  itemsIndex: number;
  lastIndex: boolean;
  Amounts: { taxAmount: number; totalAmount: number };
}

const PerfomaInvoiceTable: FC<PerfomaInvoiceTableProps> = ({
  products,
  itemsIndex,
  lastIndex,
  Amounts,
}) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px]">Quantity</TableHead>
            <TableHead className="text-right w-[50px]">Unit Price</TableHead>
            <TableHead className="text-right w-[100px]">Net Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((invoice, index) => {
            return (
              <>
                <TableRow key={invoice.id} className="">
                  <TableCell className="font-medium">
                    {itemsIndex + 1 + index}
                  </TableCell>
                  <TableCell>
                    <div className="">
                      {invoice.ProductInOrder.product.name}
                    </div>
                    <div className="">{invoice.ProductInOrder.description}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.supplidQuantity}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatPrice(invoice.ProductInOrder.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(
                      invoice.ProductInOrder.price * invoice.supplidQuantity
                    )}
                  </TableCell>
                </TableRow>
                <Separator></Separator>
              </>
            );
          })}
        </TableBody>
      </Table>
      {lastIndex && (
        <div className="flex items-center justify-end mt-2 ">
          <div className="border w-[250px] p-4  grid gap-2">
            <div className="grid grid-cols-2">
              <div className="">GST (18%)</div>
              <div className="place-self-end">
                {formatPrice(Amounts.taxAmount, true)}
              </div>
            </div>
            <Separator></Separator>
            <div className="grid grid-cols-2">
              <div className="">Total</div>
              <div className="place-self-end">
                {formatPrice(Amounts.totalAmount, true)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfomaInvoiceTable;
