import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductInInvoiceTable } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

type ProductWithItemNumber = ProductInInvoiceTable & { itemNumber: number };
interface TestTableProps {
  products: ProductWithItemNumber[];
  itemsIndex: number;
}

const TestTable: FC<TestTableProps> = ({ products, itemsIndex }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px] text-center">
              Ordered Quantity
            </TableHead>
            <TableHead className="text-center w-[50px] ">
              Supplied Quantity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((invoice, index) => {
            console.log(itemsIndex + 1 + index, itemsIndex);

            return (
              <>
                <TableRow key={invoice.id} className="">
                  <TableCell className="font-medium">
                    {invoice.itemNumber}
                  </TableCell>
                  <TableCell>
                    <div className="">
                      {invoice.ProductInOrder.product.name}
                    </div>
                    <div className="">{invoice.ProductInOrder.description}</div>
                    <div className="">
                      {invoice.ProductInOrder.product.gasGroup}
                    </div>
                    <div className="">
                      {invoice.typeNumber
                        ? invoice.typeNumber
                        : invoice.ProductInOrder.product.typeNumber}
                    </div>
                    <div className="">{invoice.certificateNumber}</div>
                  </TableCell>
                  <TableCell className="text-center w-[50px]">
                    {invoice.ProductInOrder.quantity}
                  </TableCell>

                  <TableCell className="text-center w-[50px]">
                    {invoice.supplidQuantity}
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

export default TestTable;
