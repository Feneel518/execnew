import Heading from "@/components/Global/Heading";
import { Customer } from "@prisma/client";
import { format } from "date-fns";
import { FC } from "react";

interface ChallanHeadingProps {
  customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    challanNumber: string;
    status: string;
    quotationNumber?: string;
    causeOfChallan: string;
  };
}

const ChallanHeading: FC<ChallanHeadingProps> = ({ customerDetails }) => {
  return (
    <div>
      <Heading></Heading>

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
          {customerDetails.status && (
            <div className="">
              Status: {customerDetails.status === "OPEN" ? "Open" : "Closed"}
            </div>
          )}
        </div>
        <div className="text-right flex flex-col justify-between">
          <h1 className="text-3xl uppercase tracking-tighter">
            {"Delivery Challan"}
          </h1>
          {customerDetails.causeOfChallan && (
            <div className="text-nowrap">
              Purpose: <br />
              {customerDetails.causeOfChallan === "AS_PER_SAMPLE"
                ? "As Per Sample Only"
                : customerDetails.causeOfChallan === "FOR_REPLACEMENT"
                ? "For Replacement Purpose Only"
                : "As Returnable"}{" "}
              Not for sale
            </div>
          )}

          <div className="">
            <h3>
              <div className="">
                Challan no. ExCh-{customerDetails.challanNumber}
              </div>
            </h3>
            {customerDetails.poNumber && (
              <h3 className="">
                PO Number: <strong>{customerDetails.poNumber} </strong>
              </h3>
            )}
            {customerDetails.poDate && (
              <h3 className="">
                PO Date:{" "}
                <strong>{format(customerDetails.poDate as Date, "PP")}</strong>
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallanHeading;
