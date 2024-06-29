"use client";

import A4Page from "@/components/Global/A4Page";
import { InvoicePageType } from "@/lib/types";
import { FC, useState } from "react";
import BoxTable from "./BoxTable";
import SmallHeading from "@/components/Global/SmallHeading";
import QuotationFooter from "../Quotations/QuotationFooter";

interface BoxSheetProps {
  invoiceData: InvoicePageType;
}

const BoxSheet: FC<BoxSheetProps> = ({ invoiceData }) => {
  const [perPage, setPerPage] = useState([
    invoiceData.ProductInInvoiceOfOrder.length,
  ]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return invoiceData.ProductInInvoiceOfOrder.slice(offset, offset + amount);
  });

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
              <BoxTable
                //   @ts-ignore
                products={group}
                itemsIndex={
                  index === 0 ? index : list[index - 1].length + index - 1
                }
                lastIndex={index + 1 === list.length ? true : false}
              ></BoxTable>
              //   <div className=""></div>
            }
            heading={<SmallHeading isPacking={true}></SmallHeading>}
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

export default BoxSheet;
