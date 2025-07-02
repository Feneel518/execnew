import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ProductInChallanTable } from "@/lib/types";

interface ChallanTableProps {
  products: ProductInChallanTable[];
}

const ChallanTable: FC<ChallanTableProps> = ({ products }) => {
  const total = products.reduce((acc, total) => {
    return acc + Number(total.quantity) * Number(total.price);
  }, 0);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[300px]">Items</TableHead>
            <TableHead className="w-[50px] text-right">Quantity</TableHead>
            <TableHead className="text-right w-[100px]">Price</TableHead>
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
                  <TableCell className="text-right w-[50px]">
                    {invoice.quantity}
                  </TableCell>
                  <TableCell className="text-right ">{invoice.price}</TableCell>
                </TableRow>
                <Separator></Separator>
              </>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{formatPrice(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="text-center mt-4">Not For sale</div>

      <div className="text-right mt-20">Explosion Proof Electrical Control</div>
    </div>
  );
};

export default ChallanTable;
