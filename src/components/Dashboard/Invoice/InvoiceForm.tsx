import { getOrderDetailsForInvoice } from "@/lib/queries";
import { FC } from "react";
import InvoiceFieldArray from "./InvoiceFieldArray";
import { PerfomaDetailsType } from "@/lib/types";

interface InvoiceFormProps {
  id: string;
  isInvoice?: boolean;
  checkedId?: string[];
  forPI?: { id: string; qty: number }[];
  perfomaDetails?: PerfomaDetailsType;
}

const InvoiceForm: FC<InvoiceFormProps> = async ({
  id,
  isInvoice,
  checkedId,
  forPI,
  perfomaDetails,
}) => {
  const orderDetails = await getOrderDetailsForInvoice(id);

  if (!orderDetails?.success || orderDetails.error) return;

  return (
    <div className="">
      <InvoiceFieldArray
        order={orderDetails?.success}
        isInvoice={isInvoice}
        checkedId={checkedId}
        forPI={forPI}
        perfomaDetails={perfomaDetails}
      ></InvoiceFieldArray>
    </div>
  );
};

export default InvoiceForm;
