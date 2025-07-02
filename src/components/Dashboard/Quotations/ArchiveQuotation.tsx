"use client";

import A4Page from "@/components/Global/A4Page";
import { FC, useState } from "react";
import QuotationTable from "./QuotationTable";
import QuotationHeading from "./QuotationHeading";
import QuotationFooter from "./QuotationFooter";
import { Customer, Product } from "@prisma/client";
import {
  AQuotationWithProductInQuotation,
  QuotationType,
  QuotationWithProductInQuotation,
} from "@/lib/types";
import Quotationterms from "./Quotationterms";
import SmallHeading from "@/components/Global/SmallHeading";
import QuotationTermsShort from "./QuotationTermsShort";
import AQuotationTable from "./AQuotationTable";

interface ArchiveQuotationProps {
  quotationData: AQuotationWithProductInQuotation;
}

const ArchiveQuotation: FC<ArchiveQuotationProps> = ({ quotationData }) => {
  const [perPage, setPerPage] = useState([
    quotationData.ArchivedProductInQuotation.length,
  ]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return quotationData.ArchivedProductInQuotation.slice(
      offset,
      offset + amount
    );
  });

  const termsData = [
    {
      section: "Quality and Warranty",
      points: [
        "The seller warrants that all items supplied shall be free from defects in materials and workmanship.",
        "Warranty periods for flameproof items shall be as specified by the manufacturer, and any claims under warranty must be made in accordance with the manufacturer's terms and conditions.",
        "The warranty does not cover damage resulting from misuse, neglect, or unauthorized modifications.",
      ],
    },
    {
      section: "Inspection and Acceptance",
      points: [
        "The purchaser shall inspect the items upon delivery and notify the seller of any defects or discrepancies within a reasonable period.",
        "Failure to notify the seller within the specified period shall constitute acceptance of the items.",
      ],
    },
    {
      section: "Cancellation and Returns",
      points: [
        "Orders may be cancelled by the purchaser within 3 days from the date of acceptance, subject to a cancellation fee of 5% of the total order value.",
        "Returns of items shall be subject to the seller's returns policy and may incur restocking fees and return shipping charges.",
      ],
    },
    {
      section: "Intellectual Property",
      points: [
        "Any intellectual property rights associated with the items, including but not limited to patents, trademarks, and copyrights, shall remain the property of the seller or their respective owners.",
        "The purchaser shall not reproduce, distribute, or use any intellectual property associated with the items without prior written consent.",
      ],
    },
  ];

  const customerDetails: Partial<Customer> & {
    clientName?: string;
    quotationNumber: string;
  } = {
    addressLine1: quotationData.customer.addressLine1,
    GST: quotationData.customer.GST,
    name: quotationData.customer.name,
    pincode: quotationData.customer.pincode,
    state: quotationData.customer.state,
    clientName: quotationData.clientName as string,
    createdAt: quotationData.createdAt,
    quotationNumber: quotationData.quotationNumber.toString().padStart(4, "0"),
  };

  let items = 0;
  let indexes = 0;
  return (
    <div className="flex flex-col md:gap-4 print:gap-0 relative">
      {pages.map((group, index, list) => {
        //

        //
        //

        if (group.length > 1) {
          items = group.length - 1;
        }

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
              <AQuotationTable
                itemsIndex={
                  index === 0
                    ? index
                    : list[index - 1].length + items + index - 1
                }
                // @ts-ignore
                products={group}
              ></AQuotationTable>
            }
            heading={
              index === 0 ? (
                <QuotationHeading
                  customerDetails={customerDetails}
                ></QuotationHeading>
              ) : (
                <SmallHeading></SmallHeading>
              )
            }
            additionalNotes={
              list.length === index + 1
                ? (quotationData.additionalNotes as string)
                : ""
            }
            footer={
              <QuotationFooter
                pageIndex={index + 1}
                totalLength={list.length + 2}
              ></QuotationFooter>
            }
          ></A4Page>
        );
      })}
      <div className="w-[210mm] h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col scale-[60%] sm:scale-75 md:scale-100">
        <SmallHeading></SmallHeading>
        <QuotationTermsShort
          gst={quotationData.gst}
          discount={quotationData.discount as string}
          packingCharges={quotationData.packingCharges}
          transportation={quotationData.transportationPayment}
          delivery={quotationData.deliverDateNew as string}
          payment={quotationData.paymentTerms}
          footer={
            <QuotationFooter
              pageIndex={quotationData.ArchivedProductInQuotation.length + 1}
              totalLength={quotationData.ArchivedProductInQuotation.length + 2}
            ></QuotationFooter>
          }
        ></QuotationTermsShort>
      </div>
      <div className="w-[210mm] h-[297mm] print:size-[A4] bg-white text-black shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-col scale-[60%] sm:scale-75 md:scale-100">
        <SmallHeading></SmallHeading>
        <div className="flex flex-col h-full">
          <div className="p-8 flex-1">
            {termsData.map((terms, index) => {
              return (
                <div className="" key={index}>
                  <h1 className="font-bold">
                    {index + 6} {terms.section}:
                  </h1>
                  {terms.points.map((point, pointIndex) => {
                    return (
                      <p key={pointIndex}>
                        {index + 6}.{pointIndex + 1} {point}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <QuotationFooter
            pageIndex={quotationData.ArchivedProductInQuotation.length + 2}
            totalLength={quotationData.ArchivedProductInQuotation.length + 2}
          ></QuotationFooter>
        </div>
      </div>
    </div>
  );
  // return <div className=""></div>;
};

export default ArchiveQuotation;
