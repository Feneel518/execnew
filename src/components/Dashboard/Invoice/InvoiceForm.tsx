import { getOrderDetailsForInvoice } from "@/lib/queries";
import { FC } from "react";
import InvoiceFieldArray from "./InvoiceFieldArray";

interface InvoiceFormProps {
  id: string;
}

const InvoiceForm: FC<InvoiceFormProps> = async ({ id }) => {
  const orderDetails = await getOrderDetailsForInvoice(id);

  if (!orderDetails?.success || orderDetails.error) return;

  return (
    <div className="">
      <InvoiceFieldArray order={orderDetails?.success}></InvoiceFieldArray>
    </div>
  );
};

export default InvoiceForm;
