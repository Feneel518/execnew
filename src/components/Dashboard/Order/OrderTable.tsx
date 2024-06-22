import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ProductInOrderTable } from "@/lib/types";

interface OrderTableProps {
  products: ProductInOrderTable[];
  itemsIndex: number;
}

const OrderTable: FC<OrderTableProps> = ({ products, itemsIndex }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px]">Quantity</TableHead>
            <TableHead className="text-right w-[100px]">Unit Price</TableHead>
            <TableHead className="text-right w-[50px]">Supplied</TableHead>
            <TableHead className="text-right w-[100px]">Certificate</TableHead>
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
                    <div className="">{invoice.product.name}</div>
                    <div className="">{invoice.description}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.quantity -
                      (invoice.supplied ? invoice.supplied : 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(invoice.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.supplied ? invoice.supplied : 0}
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    {invoice.certificateNumber ? invoice.certificateNumber : ""}
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

export default OrderTable;
