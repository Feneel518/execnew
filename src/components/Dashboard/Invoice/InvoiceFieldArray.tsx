"use client";

import { OrderInvoice, PerfomaDetailsType } from "@/lib/types";
import { FC, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateRemainingQuantities } from "@/lib/utils";
import PerfomaProductForm from "../Perfoma/PerfomaProductForm";
import InvoiceProductForm from "./InvoiceProductForm";
interface InvoiceFieldArrayProps {
  order: OrderInvoice;
  isInvoice?: boolean;
  checkedId?: string[];
  forPI?: { id: string; qty: number }[];
  perfomaDetails?: PerfomaDetailsType;
}

const InvoiceFieldArray: FC<InvoiceFieldArrayProps> = ({
  order,
  isInvoice,
  checkedId,
}) => {
  const [checked, setChecked] = useState<string[]>(checkedId ? checkedId : []);

  const acc = calculateRemainingQuantities(order, order.Invoice);

  const filteredOrderProducts = order.ProductInOrder.filter(
    (product) => acc[product.id] > 0
  );

  // const abc = areQuantitiesEqual(order, order.Invoice);

  return (
    <div>
      <Card className="p-4">
        <CardContent className="flex lg:flex-row flex-col w-full gap-8 justify-between">
          <div className="flex flex-col gap-2">
            <Label className="">
              Select Product for {isInvoice ? "Invoice" : "Perfoma Invoice"}{" "}
            </Label>
            <Separator className="mb-4"></Separator>
            <div className=" grid-cols-4 ml-6 lg:grid hidden">
              <div className="">Product Name</div>
              <div className="text-center">Product Description</div>
              <div className="text-center">Pending Quantity</div>
            </div>
            <Separator className="bg-black mb-2 "></Separator>
            {filteredOrderProducts.map((item) => {
              return (
                <div key={item.id}>
                  <div className="flex  items-center gap-2">
                    <Checkbox
                      className="border-black"
                      checked={checked.includes(item.id)}
                      onCheckedChange={(check) => {
                        return check
                          ? setChecked([...checked, item.id])
                          : setChecked(
                              checked?.filter((value) => value !== item.id)
                            );
                      }}
                    />
                    <div className="grid lg:grid-cols-4 w-full gap-2 lg:gap-8">
                      <Label>{item.product.name}</Label>
                      <Label className="text-center">{item.description}</Label>
                      <Label className="text-center">
                        <span className="lg:hidden">Quantity: </span>
                        {acc[item.id]}
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
      {checked.length > 0 &&
        (isInvoice ? (
          <InvoiceProductForm
            id={checked}
            order={order}
            remainingQuantity={acc}
          ></InvoiceProductForm>
        ) : (
          <PerfomaProductForm
            id={checked}
            order={order}
            remainingQuantity={acc}
            // forPI={forPI}
            // perfomaDetails={perfomaDetails}
          ></PerfomaProductForm>
        ))}
    </div>
  );
};

export default InvoiceFieldArray;
