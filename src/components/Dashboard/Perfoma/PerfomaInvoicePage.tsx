"use client";

import A4Page from "@/components/Global/A4Page";
import { perfomaInvoiceForDisplay } from "@/lib/types";
import { Customer } from "@prisma/client";
import { FC, useState } from "react";
import InvoiceTable from "../Invoice/InvoiceTable";
import OrderHeading from "../Order/OrderHeading";
import SmallHeading from "@/components/Global/SmallHeading";
import QuotationFooter from "../Quotations/QuotationFooter";
import PerfomaInvoiceTable from "./PerfomaInvoiceTable";
import PerfomaInvoiceHeading from "./PerfomaInvoiceHeading";
import { taxAmountCalculation } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PerfomaInvoicePageProps {
  invoiceData: perfomaInvoiceForDisplay;
}

const PerfomaInvoicePage: FC<PerfomaInvoicePageProps> = ({ invoiceData }) => {
  const [perPage, setPerPage] = useState([
    invoiceData.ProductInPerfomaInvoiceOfOrder.length,
  ]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return invoiceData.ProductInPerfomaInvoiceOfOrder.slice(
      offset,
      offset + amount
    );
  });

  const termsAndConditions = [
    {
      title: "Validity",
      description:
        "This proforma invoice is valid for [X days] from the issue date. Prices, terms, and availability may change if payment or confirmation is not received within this period.",
    },
    {
      title: "Payment",
      description:
        "Full payment is required before shipment or service delivery, in [currency, e.g., USD]. Accepted payment methods include [e.g., bank transfer, credit card].",
    },
    {
      title: "Taxes and Shipping",
      description:
        "Prices exclude taxes, duties, and shipping costs unless stated otherwise. The buyer is responsible for any additional fees incurred.",
    },
    {
      title: "Governing Law",
      description:
        "This invoice is governed by the laws of [jurisdiction], and disputes will be resolved in [location].",
    },
  ];
  //

  const taxAmount = taxAmountCalculation(
    //  @ts-ignores
    invoiceData.ProductInPerfomaInvoiceOfOrder
  );

  const customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    perfomaInvoiceNumber: string;
    perfomaInvoiceDate: Date;
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
    perfomaInvoiceNumber: invoiceData.perfomaInvoiceNumber
      .toString()
      .padStart(4, "0"),
    perfomaInvoiceDate: invoiceData.perfomaInvoiceDate,
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
              <PerfomaInvoiceTable
                products={group}
                itemsIndex={
                  index === 0 ? index : list[index - 1].length + index - 1
                }
                lastIndex={index + 1 === list.length ? true : false}
                Amounts={taxAmount}
              ></PerfomaInvoiceTable>
            }
            heading={
              index === 0 ? (
                <PerfomaInvoiceHeading
                  customerDetails={customerDetails}
                ></PerfomaInvoiceHeading>
              ) : (
                <SmallHeading></SmallHeading>
              )
            }
            footer={
              <QuotationFooter
                pageIndex={index + 1}
                totalLength={list.length + 1}
              ></QuotationFooter>
            }
          ></A4Page>
        );
      })}

      <div className="w-[210mm] h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col">
        <SmallHeading></SmallHeading>
        <div className="flex flex-col h-full">
          <div className="p-8 flex-1 gap-12 flex flex-col">
            <div className="">
              <h1 className="text-center mb-4 underline underline-offset-4">
                Bank Details
              </h1>

              <div className="grid grid-cols-2">
                <div className="">Bank Name</div>
                <div className="">:TJSB BANK LTD</div>
                <div className="">Currenty Account</div>
                <div className="">
                  :131120100000061 (Explosion Proof Electrical Control)
                </div>
                <div className="">Branch</div>
                <div className="">:VAPI</div>
                <div className="">IFSC Code</div>
                <div className="">:TJSB0000131</div>
              </div>
            </div>

            <div className="">
              <h1 className="text-center mb-4 underline underline-offset-4">
                Terms And Conditions
              </h1>
              {termsAndConditions.map((terms, index) => {
                return (
                  <div className="" key={index}>
                    <h1 className="font-bold">
                      {index + 1} {terms.title}:
                    </h1>
                    <p>{terms.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <QuotationFooter
            pageIndex={invoiceData.ProductInPerfomaInvoiceOfOrder.length + 1}
            totalLength={invoiceData.ProductInPerfomaInvoiceOfOrder.length + 1}
          ></QuotationFooter>
        </div>
      </div>
    </div>
  );
};

export default PerfomaInvoicePage;
