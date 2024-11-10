import Heading from "@/components/Global/Heading";
import { Customer } from "@prisma/client";
import { format } from "date-fns";
import { FC } from "react";

interface PerfomaInvoiceHeadingProps {
  customerDetails: Partial<Customer> & {
    poNumber?: string;
    poDate?: Date;
    orderNumber: string;
    perfomaInvoiceNumber: string;
    perfomaInvoiceDate: Date;
  };
}

const PerfomaInvoiceHeading: FC<PerfomaInvoiceHeadingProps> = ({
  customerDetails,
}) => {
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
        </div>
        <div className="text-right flex flex-col justify-between">
          <h1 className="-mt-6 text-xs">
            {format(
              customerDetails.perfomaInvoiceDate
                ? customerDetails.perfomaInvoiceDate
                : new Date(),
              "PP"
            )}
          </h1>
          <h1 className="text-3xl uppercase tracking-tighter">
            Perfoma Invoice <br />
            ExPI-{customerDetails.perfomaInvoiceNumber}
          </h1>

          <div className="">
            {customerDetails.poNumber && (
              <p className="">
                PO Number: <strong>{customerDetails.poNumber} </strong>
              </p>
            )}
            {customerDetails.poDate && (
              <p className="">
                PO Date:{" "}
                <strong>{format(customerDetails.poDate as Date, "PP")}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfomaInvoiceHeading;
