"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InvoiceEditType, OrderInvoice } from "@/lib/types";
import { FC, useState } from "react";
import NewInvoiceProductForm from "./NewInvoiceProductForm";
import { calculateRemainingQuantities } from "@/lib/utils";

interface NewInvoiceFieldArrayProps {
  order: OrderInvoice;
  checkedIds?: string[];
  invoiceId?: string;
  invoiceDetails?: InvoiceEditType;
}

const NewInvoiceFieldArray: FC<NewInvoiceFieldArrayProps> = ({
  order,
  checkedIds,
  invoiceId,
  invoiceDetails,
}) => {
  const [checked, setChecked] = useState<string[]>(
    checkedIds ? checkedIds : []
  );

  const acc = calculateRemainingQuantities(order, order.Invoice, invoiceId);

  const filteredOrderProducts = order.ProductInOrder.filter(
    (product) => acc[product.id] > 0
  );

  return (
    <div className="">
      <Card className="p-4">
        <CardContent className="flex lg:flex-row flex-col w-full gap-8 justify-between">
          <div className="flex flex-col gap-2">
            <Label className="">Select Product for Invoice</Label>
            <Separator className="mb-4"></Separator>
            <div className=" grid-cols-4 ml-6 lg:grid hidden">
              <div className="">Product Name</div>
              <div className="text-center">Product Description</div>
              <div className="text-center">Pending Quantity</div>
            </div>
            <Separator className="bg-black mb-2 "></Separator>
            {filteredOrderProducts.map((product) => {
              return (
                <div key={product.id}>
                  <div className="flex  items-center gap-2">
                    <Checkbox
                      className="border-black"
                      checked={checked.includes(product.id)}
                      onCheckedChange={(check) => {
                        return check
                          ? setChecked([...checked, product.id])
                          : setChecked(
                              checked?.filter((value) => value !== product.id)
                            );
                      }}
                    />
                    <div className="grid lg:grid-cols-4 w-full gap-2 lg:gap-8">
                      <Label>{product.product.name}</Label>
                      <Label className="text-center">
                        {product.description}
                      </Label>
                      <Label className="text-center">
                        <span className="lg:hidden">Quantity: </span>
                        {acc[product.id]}
                      </Label>
                    </div>
                  </div>
                  <Separator className="my-4"></Separator>
                </div>
              );
            })}
          </div>
          <div className="mb-4 ">
            <Button type="button" onClick={() => setChecked([])}>
              Clear all Products
            </Button>
          </div>
        </CardContent>
      </Card>
      {checked.length > 0 && (
        <NewInvoiceProductForm
          order={order}
          selectedProductIds={checked}
          remainingQuantity={acc}
          invoiceDetails={invoiceDetails}
        ></NewInvoiceProductForm>
      )}
    </div>
  );
};

export default NewInvoiceFieldArray;
