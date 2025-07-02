import InvoiceForm from "@/components/Dashboard/Invoice/InvoiceForm";
import { getPerfomaInvoiceDetails } from "@/lib/queries";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
  searchParams: {
    orderId: string;
  };
}

const page: FC<pageProps> = async ({ searchParams, params }) => {
  const perfomaDetails = await getPerfomaInvoiceDetails(params.id);
  if (!perfomaDetails?.success || perfomaDetails.error)
    redirect("/dashboard/perfoma");

  const checkedId =
    perfomaDetails.success.ProductInPerfomaInvoiceOfOrder.flatMap(
      (abc) => abc.productInOrderId
    );

  const idWithQty =
    perfomaDetails.success.ProductInPerfomaInvoiceOfOrder.flatMap((abc) => {
      return {
        id: abc.productInOrderId,
        qty: abc.supplidQuantity,
      };
    });

  return (
    <div>
      {searchParams.orderId && (
        <InvoiceForm
          id={searchParams.orderId}
          isInvoice={false}
          checkedId={checkedId}
          forPI={idWithQty}
          perfomaDetails={perfomaDetails.success}
        ></InvoiceForm>
      )}
    </div>
  );
};

export default page;
