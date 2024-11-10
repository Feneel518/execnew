"use client";
import A4Page from "@/components/Global/A4Page";
import SmallHeading from "@/components/Global/SmallHeading";
import { ChallanTypeForDisplay } from "@/lib/types";
import { assignContinuousIndices } from "@/lib/utils";
import { Customer } from "@prisma/client";
import { FC, useState } from "react";
import QuotationFooter from "../Quotations/QuotationFooter";
import OrderHeading from "../Order/OrderHeading";
import ChallanHeading from "./ChallanHeading";
import ChallanTable from "./ChallanTable";

interface ChallanProps {
  challan: ChallanTypeForDisplay;
}

const Challan: FC<ChallanProps> = ({ challan }) => {
  const [perPage, setPerPage] = useState([challan.ProductInChallan.length]);

  let pages = perPage.map((amount, i) => {
    let offset = perPage
      .slice(0, i)
      .reduce((total, amount) => total + amount, 0);
    return challan.ProductInChallan.slice(offset, offset + amount);
  });

  const indexedArrays = assignContinuousIndices(...pages);

  const customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    challanNumber: string;
    status: string;
    quotationNumber?: string;
    causeOfChallan: string;
  } = {
    addressLine1: challan.customer.addressLine1,
    GST: challan.customer.GST,
    name: challan.customer.name,
    pincode: challan.customer.pincode,
    state: challan.customer.state,
    createdAt: challan.createdAt,
    challanNumber: challan.challanNumber.toString().padStart(4, "0"),
    poNumber: challan.poNumber ?? "",
    poDate: challan.poDate ?? new Date(),
    status: challan.status,
    causeOfChallan: challan.causeOfChallan,
  };
  return (
    <div className="flex flex-col gap-4 print:gap-0">
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
              <ChallanTable products={group}></ChallanTable>
              //   <OrderTable
              //     //   @ts-ignore
              //     products={group}
              //     isWorkOrder={isWorkOrder}
              //     remainingQuantity={remainingQuantity}
              //   ></OrderTable>
            }
            heading={
              index === 0 ? (
                <ChallanHeading
                  customerDetails={customerDetails}
                ></ChallanHeading>
              ) : (
                <SmallHeading
                  orderNumber={challan.challanNumber}
                ></SmallHeading>
              )
            }
            additionalNotes={
              list.length === index + 1
                ? (challan.additionalNotes as string)
                : ""
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

export default Challan;
