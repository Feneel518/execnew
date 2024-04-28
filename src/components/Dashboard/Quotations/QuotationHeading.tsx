import Image from "next/image";
import { FC } from "react";
import Logo from "../../../../public/logo1.png";
import { Lora } from "next/font/google";
import { Customer } from "@prisma/client";
import { format } from "date-fns";
import Heading from "@/components/Global/Heading";

interface QuotationHeadingProps {
  customerDetails: Partial<Customer> & {
    clientName?: string;
    quotationNumber: string;
  };
}

const QuotationHeading: FC<QuotationHeadingProps> = ({ customerDetails }) => {
  return (
    <div>
      <Heading></Heading>
      <div className={`w-full p-8   flex justify-between border-b`}>
        <div className={`flex flex-col w-[180px] gap-2 `}>
          <h1 className="text-lg leading-tight">
            {customerDetails.clientName}
          </h1>
          <div className="">
            {/* Change its name */}
            <h1 className="text-lg leading-tight">{customerDetails.name}</h1>
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
          <h1 className="text-3xl uppercase tracking-tighter">Quotation</h1>
          <div className="">
            <h3>Qtn no. ExQn-{customerDetails.quotationNumber} </h3>
            <h3>{format(customerDetails.createdAt as Date, "PP")}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationHeading;
