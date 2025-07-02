"use client";

import { PendingCustomerTable } from "@/lib/types";
import { Customer } from "@prisma/client";
import { FC, useState } from "react";
import OrderHeading from "../Order/OrderHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PendingOrderPageProps {
  order: PendingCustomerTable;
  remainingQuantity: { [x: string]: number };
}

const PendingOrderPage: FC<PendingOrderPageProps> = ({
  order,
  remainingQuantity,
}) => {
  const customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    status: string;
    quotationNumber?: string;
  } = {
    addressLine1: order.customer.addressLine1,
    GST: order.customer.GST,
    name: order.customer.name,
    pincode: order.customer.pincode,
    state: order.customer.state,
    createdAt: order.createdAt,
    orderNumber: order.orderNumber.toString().padStart(4, "0"),
    poNumber: order.poNumber ?? "",
    poDate: order.poDate ?? new Date(),
    status: order.status,
    quotationNumber: order.quotationNumber ?? "",
  };
  return (
    <div className="w-full border p-8 rounded-md">
      <OrderHeading customerDetails={customerDetails}></OrderHeading>
      <div className="bg-white p-8 rounded-md">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="w-[300px]">Items</TableHead>
                <TableHead className="w-[50px]">Quantity</TableHead>

                <TableHead className="text-right w-[100px]">
                  Unit Price
                </TableHead>

                <TableHead className="text-right w-[50px]">
                  Supplied Quantity
                </TableHead>
                <TableHead className="text-right w-[100px]">
                  Pending Qantity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.ProductInOrder.map((invoice, index) => {
                return (
                  <>
                    <TableRow key={invoice.id} className="text-black">
                      <TableCell className="font-medium">{1 + index}</TableCell>
                      <TableCell>
                        <div className="">{invoice.product.name}</div>
                        <div className="">{invoice.description}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.quantity}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatPrice(invoice.price)}
                      </TableCell>

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
        </div>
      </div>
    </div>
  );
};

export default PendingOrderPage;
