import { ProductInInvoiceTable } from "@/lib/types";
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

interface BoxTableProps {
  products: ProductInInvoiceTable[];
  itemsIndex: number;
  lastIndex: boolean;
}

const BoxTable: FC<BoxTableProps> = ({ itemsIndex, products, lastIndex }) => {
  const totalBoxes = products.reduce((acc, items) => {
    return acc + (items.numberOfBoxes ? items.numberOfBoxes : 0);
  }, 0);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px] text-center">
              Number of Boxes
            </TableHead>
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
                  </TableCell>
                  <TableCell className="text-center w-[50px]">
                    {invoice.numberOfBoxes}
                  </TableCell>
                </TableRow>
                <Separator></Separator>
              </>
            );
          })}
        </TableBody>
      </Table>
      {lastIndex && (
        <div className="flex items-center justify-end mt-2 mr-12 ">
          <div className="border w-[250px] p-4  grid gap-2">
            <div className="grid grid-cols-2">
              <div className="">Total Boxes</div>
              <div className="place-self-end">{totalBoxes}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxTable;
