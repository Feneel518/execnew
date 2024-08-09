import InvoiceEditFieldArray from "@/components/Dashboard/Invoice/InvoiceEditFieldArray";
import InvoiceFieldArray from "@/components/Dashboard/Invoice/InvoiceFieldArray";
import { getInvoiceDetails, getOrderDetailsForInvoice } from "@/lib/queries";
import { calculateRemainingQuantities } from "@/lib/utils";
import { FC } from "react";

interface pageProps {
  params: {
    invoiceNumber: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const invoiceDetails = await getInvoiceDetails(params.invoiceNumber);

  if (!invoiceDetails?.success || invoiceDetails.error) return;
  const orderDetails = await getOrderDetailsForInvoice(
    invoiceDetails?.success?.orderId
  );
  if (!orderDetails?.success || orderDetails.error) return;

  const remainingInvoices = orderDetails.success.Invoice.filter(
    (id) => id.invoiceNumberSlug !== params.invoiceNumber
  );

  const acc = calculateRemainingQuantities(
    orderDetails?.success,
    remainingInvoices
  );

  return (
    <div>
      {/* <InvoiceFieldArray order={}></InvoiceFieldArray> */}
      <InvoiceEditFieldArray
        invoice={invoiceDetails?.success}
        remainingQuantity={acc}
      ></InvoiceEditFieldArray>
    </div>
  );
};

export default page;
