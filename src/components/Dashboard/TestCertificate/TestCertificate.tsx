"use client";

import A4Page from "@/components/Global/A4Page";
import { InvoicePageType } from "@/lib/types";
import { Customer } from "@prisma/client";
import { FC, useState } from "react";
import OrderHeading from "../Order/OrderHeading";
import SmallHeading from "@/components/Global/SmallHeading";
import QuotationFooter from "../Quotations/QuotationFooter";

import { taxAmountCalculation } from "@/lib/utils";
import InvoiceTable from "../Invoice/InvoiceTable";
import TestHeading from "./TestHeading";
import TestTable from "./TestTable";
import TestData from "./TestData";
import { format } from "date-fns";

interface TestCertificateProps {
  invoiceData: InvoicePageType;
}

const TestCertificate: FC<TestCertificateProps> = ({ invoiceData }) => {
  const [perPage, setPerPage] = useState([
    invoiceData.ProductInInvoiceOfOrder.length,
  ]);

  let itemCounter = 1;
  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return invoiceData.ProductInInvoiceOfOrder.slice(
      offset,
      offset + amount
    ).map((product) => ({ ...product, itemNumber: itemCounter++ }));
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
      <div className="">
        {pages.map((group, index, list) => {
          console.log(group);

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
                <TestTable
                  //   @ts-ignore
                  products={group}
                  itemsIndex={
                    // index === 0 ? index : list[index - 1].length + index - 1
                    index === 0 ? 0 : group.length
                  }
                  lastIndex={index + 1 === list.length ? true : false}
                  Amounts={taxAmount}></TestTable>
                //   <div className=""></div>
              }
              heading={
                index === 0 ? (
                  <TestHeading customerDetails={customerDetails}></TestHeading>
                ) : (
                  <SmallHeading></SmallHeading>
                )
              }
              footer={
                <QuotationFooter
                  pageIndex={index + 1}
                  totalLength={list.length}></QuotationFooter>
              }></A4Page>
          );
        })}
      </div>
      {invoiceData && (
        <div className="w-[210mm] h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col">
          <SmallHeading></SmallHeading>
          <div className={`w-full p-8  flex justify-between border-b`}>
            <div className={`flex flex-col w-[180px] gap-2 `}>
              <h1 className="text-lg leading-tight">{customerDetails.name}</h1>

              <div className="">
                {/* Change its name */}
                {/* <h1 className="text-lg leading-tight">{customerDetails.name}</h1> */}
                <p className="text-xs">{customerDetails.addressLine1}</p>
                <p className="text-xs">
                  {customerDetails.state}, {customerDetails.pincode}
                </p>
                {customerDetails.GST && (
                  <p className="text-xs">{customerDetails.GST}</p>
                )}
              </div>
            </div>
            <div className="text-right flex flex-col justify-between">
              <h1 className="text-3xl uppercase tracking-tighter">
                test certificate
              </h1>
              <h1 className="">{format(customerDetails.invoiceDate, "PP")}</h1>
              <div className="">
                <h3>TC no. ExTC {customerDetails.invoiceNumber}</h3>
                {customerDetails.poNumber && (
                  <h3 className="">
                    PO Number: <strong>{customerDetails.poNumber} </strong>
                  </h3>
                )}
                {customerDetails.poDate && (
                  <h3 className="">
                    PO Date:{" "}
                    <strong>
                      {format(customerDetails.poDate as Date, "PP")}
                    </strong>
                  </h3>
                )}
              </div>
            </div>
          </div>

          <TestData></TestData>
        </div>
      )}
    </div>
  );
};

export default TestCertificate;
