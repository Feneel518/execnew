import InvoiceEditFieldArray from "@/components/Dashboard/Invoice/InvoiceEditFieldArray";
import InvoiceFieldArray from "@/components/Dashboard/Invoice/InvoiceFieldArray";
import InvoiceForm from "@/components/Dashboard/Invoice/InvoiceForm";
import NewInvoiceForm from "@/components/Dashboard/Invoice/NewInvoiceForm";
import { getInvoiceDetails, getOrderDetailsForInvoice } from "@/lib/queries";
import { calculateRemainingQuantities } from "@/lib/utils";
import { FC } from "react";

interface pageProps {
  params: {
    invoiceNumber: string;
  };
  searchParams: {
    orderId: string;
  };
}

const page: FC<pageProps> = async ({ params, searchParams }) => {
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

  const checkedId = invoiceDetails.success.ProductInInvoiceOfOrder.flatMap(
    (abc) => abc.productInOrderId
  );

  return (
    <div>
      {searchParams.orderId && (
        <NewInvoiceForm
          invoiceDetails={invoiceDetails.success}
          orderId={searchParams.orderId}
          checkedIds={checkedId}
          invoiceId={invoiceDetails.success.id}
        ></NewInvoiceForm>
        // <InvoiceForm
        //   id={searchParams.orderId}
        //   checkedId={checkedId}
        //   isInvoice={true}
        // ></InvoiceForm>
      )}
      {/* <InvoiceFieldArray order={}></InvoiceFieldArray> */}
      {/* <InvoiceEditFieldArray
        invoice={invoiceDetails?.success}
        remainingQuantity={acc}
      ></InvoiceEditFieldArray> */}
    </div>
  );
};

export default page;
