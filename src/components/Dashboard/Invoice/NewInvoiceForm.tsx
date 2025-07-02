import { getOrderDetailsForInvoice } from "@/lib/queries";
import { FC } from "react";
import NewInvoiceFieldArray from "./NewInvoiceFieldArray";
import { InvoiceEditType } from "@/lib/types";

interface NewInvoiceFormProps {
  orderId: string;
  checkedIds?: string[];
  invoiceId?: string;
  invoiceDetails?: InvoiceEditType;
}

const NewInvoiceForm: FC<NewInvoiceFormProps> = async ({
  orderId,
  checkedIds,
  invoiceId,
  invoiceDetails,
}) => {
  const orderDetails = await getOrderDetailsForInvoice(orderId);

  if (!orderDetails?.success || orderDetails.error) return;

  return (
    <div>
      <NewInvoiceFieldArray
        order={orderDetails.success}
        checkedIds={checkedIds}
        invoiceId={invoiceId}
        invoiceDetails={invoiceDetails}
      ></NewInvoiceFieldArray>
    </div>
  );
};

export default NewInvoiceForm;
