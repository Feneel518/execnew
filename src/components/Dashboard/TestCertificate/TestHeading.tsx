import Heading from "@/components/Global/Heading";
import { Customer } from "@prisma/client";
import { format } from "date-fns";
import { FC } from "react";

interface TestHeadingProps {
  customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    status?: string;
    quotationNumber?: string;
    invoiceNumber?: string;
    invoiceDate?: Date;
  };
}

const TestHeading: FC<TestHeadingProps> = ({ customerDetails }) => {
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
            <div className="">Status: {customerDetails.status}</div>
          )}
        </div>
        <div className="text-right flex flex-col justify-between">
          <h1 className="text-3xl uppercase tracking-tighter">
            test certificate
          </h1>
          <h1 className="">
            {format(
              customerDetails.invoiceDate
                ? customerDetails.invoiceDate
                : new Date(),
              "PP"
            )}
          </h1>
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
                <strong>{format(customerDetails.poDate as Date, "PP")}</strong>
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeading;
