import { getOrderDetailsForInvoice } from "@/lib/queries";
import { FC } from "react";
import InvoiceFieldArray from "./InvoiceFieldArray";

interface InvoiceFormProps {
  id: string;
  isInvoice?: boolean;
}

const InvoiceForm: FC<InvoiceFormProps> = async ({ id, isInvoice }) => {
  const orderDetails = await getOrderDetailsForInvoice(id);

  if (!orderDetails?.success || orderDetails.error) return;

  return (
    <div className="">
      <InvoiceFieldArray
        order={orderDetails?.success}
        isInvoice={isInvoice}
      ></InvoiceFieldArray>
    </div>
  );
};

export default InvoiceForm;
