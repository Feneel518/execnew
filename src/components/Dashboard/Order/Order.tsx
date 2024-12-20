"use client";

import A4Page from "@/components/Global/A4Page";
import { OrderToView } from "@/lib/types";
import { Customer } from "@prisma/client";
import { FC, useState } from "react";
import OrderTable from "./OrderTable";
import OrderHeading from "./OrderHeading";
import QuotationFooter from "../Quotations/QuotationFooter";
import SmallHeading from "@/components/Global/SmallHeading";
import { assignContinuousIndices, cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface OrderProps {
  orderData: OrderToView;
  isWorkOrder?: boolean;
  remainingQuantity: { [x: string]: number };
}

const Order: FC<OrderProps> = ({
  orderData,
  isWorkOrder,
  remainingQuantity,
}) => {
  const [perPage, setPerPage] = useState([orderData.ProductInOrder.length]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return orderData.ProductInOrder.slice(offset, offset + amount);
  });

  const indexedArrays = assignContinuousIndices(...pages);

  const customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    status: string;
    quotationNumber?: string;
  } = {
    addressLine1: orderData.customer.addressLine1,
    GST: orderData.customer.GST,
    name: orderData.customer.name,
    pincode: orderData.customer.pincode,
    state: orderData.customer.state,
    createdAt: orderData.createdAt,
    orderNumber: orderData.orderNumber.toString().padStart(4, "0"),
    poNumber: orderData.poNumber ?? "",
    poDate: orderData.poDate ?? new Date(),
    status: orderData.status,
    quotationNumber: orderData.quotationNumber ?? "",
  };
  return (
    <div className="flex flex-col gap-4 print:gap-0">
      {orderData.orderPDFFile && (
        <Link
          target="_blank"
          href={orderData.orderPDFFile ?? ""}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "w-40 mx-auto print:hidden"
          )}
        >
          View PDF
        </Link>
      )}
      {indexedArrays.map((group, index, list) => {
        return (
          <A4Page
            onResize={() => {
              setPerPage((perPage) => {
                let clone = perPage.slice();
                clone[index] -= 1;
                clone[index + 1] = clone[index + 1] || 0;
                clone[index + 1] += 1;

                return clone;
              });
            }}
            key={index}
            table={
              <OrderTable
                //   @ts-ignore
                products={group}
                isWorkOrder={isWorkOrder}
                remainingQuantity={remainingQuantity}
              ></OrderTable>
            }
            heading={
              index === 0 ? (
                <OrderHeading
                  isWorkOrder={isWorkOrder}
                  customerDetails={customerDetails}
                ></OrderHeading>
              ) : (
                <SmallHeading
                  orderNumber={orderData.orderNumber}
                ></SmallHeading>
              )
            }
            additionalNotes={
              list.length === index + 1 ? (orderData.notes as string) : ""
            }
            footer={
              <QuotationFooter
                pageIndex={index + 1}
                totalLength={list.length}
              ></QuotationFooter>
            }
          ></A4Page>
        );
      })}
    </div>
  );
};

export default Order;
