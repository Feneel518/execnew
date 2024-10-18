"use client";

import A4Page from "@/components/Global/A4Page";
import { InvoicePageType } from "@/lib/types";
import { Customer } from "@prisma/client";
import { FC, useState } from "react";
import OrderHeading from "../Order/OrderHeading";
import SmallHeading from "@/components/Global/SmallHeading";
import QuotationFooter from "../Quotations/QuotationFooter";
import InvoiceTable from "./InvoiceTable";
import { taxAmountCalculation } from "@/lib/utils";
import TestData from "../TestCertificate/TestData";

interface InvoicePageProps {
  invoiceData: InvoicePageType;
}

const InvoicePage: FC<InvoicePageProps> = ({ invoiceData }) => {
  const [perPage, setPerPage] = useState([
    invoiceData.ProductInInvoiceOfOrder.length,
  ]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return invoiceData.ProductInInvoiceOfOrder.slice(offset, offset + amount);
  });

  //

  // @ts-ignore
  const taxAmount = taxAmountCalculation(invoiceData.ProductInInvoiceOfOrder);

  const customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    quotationNumber?: string;
    invoiceNumber: string;
    invoiceDate: Date;
  } = {
    addressLine1: invoiceData.order.customer.addressLine1,
    GST: invoiceData.order.customer.GST,
    name: invoiceData.order.customer.name,
    pincode: invoiceData.order.customer.pincode,
    state: invoiceData.order.customer.state,
    createdAt: invoiceData.createdAt,
    orderNumber: invoiceData.order.orderNumber.toString().padStart(4, "0"),
    poNumber: invoiceData.order.poNumber ?? "",
    poDate: invoiceData.order.poDate ?? new Date(),
    quotationNumber: invoiceData.order.quotationNumber ?? "",
    invoiceNumber: invoiceData.invoiceNumber ?? "",
    invoiceDate: invoiceData.invoiceDate,
  };
  return (
    <div className="flex flex-col gap-4 print:gap-0">
      {pages.map((group, index, list) => {
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
              <InvoiceTable
                //   @ts-ignore
                products={group}
                itemsIndex={
                  index === 0 ? index : list[index - 1].length + index - 1
                }
                lastIndex={index + 1 === list.length ? true : false}
                Amounts={taxAmount}
              ></InvoiceTable>
              //   <div className=""></div>
            }
            heading={
              index === 0 ? (
                <OrderHeading
                  isWorkOrder={false}
                  customerDetails={customerDetails}
                  isInvoice={true}
                ></OrderHeading>
              ) : (
                <SmallHeading></SmallHeading>
              )
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

export default InvoicePage;
