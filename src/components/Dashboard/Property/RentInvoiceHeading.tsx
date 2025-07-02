import { FC } from "react";
import Heading from "@/components/Global/Heading";
import { format } from "date-fns";

interface RentInvoiceHeadingProps {
  tenant: {
    name: string;
    contact: string;
    email?: string | null;
  };
  invoiceNumber: string;
  month: string;
  createdAt: Date;
}

const RentInvoiceHeading: FC<RentInvoiceHeadingProps> = ({
  tenant,
  invoiceNumber,
  month,
  createdAt,
}) => {
  return (
    <div>
      <Heading />

      <div className="w-full p-8 flex justify-between border-b">
        {/* Tenant Info */}
        <div className="flex flex-col w-[200px] gap-2">
          <h1 className="text-lg leading-tight">{tenant.name}</h1>
          <p className="text-xs">{tenant.contact}</p>
          {tenant.email && <p className="text-xs">{tenant.email}</p>}
        </div>

        {/* Invoice Info */}
        <div className="text-right flex flex-col justify-between">
          <h1 className="text-3xl uppercase tracking-tight">Rent Invoice</h1>
          <div className="text-sm mt-2">
            <h3>Invoice No: RENT-{invoiceNumber}</h3>
            <h3>Month: {month}</h3>
            <h3>Date: {format(createdAt, "dd MMM yyyy")}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentInvoiceHeading;
