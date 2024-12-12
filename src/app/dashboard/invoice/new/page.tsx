import InvoiceForm from "@/components/Dashboard/Invoice/InvoiceForm";
import NewInvoiceForm from "@/components/Dashboard/Invoice/NewInvoiceForm";
import SelectClientForInvoice from "@/components/Dashboard/Order/SelectClientForInvoice";
import POSelection from "@/components/Dashboard/Orders/POSelection";
import { FC } from "react";

interface pageProps {
  searchParams: {
    client: string;
    orderId: string;
  };
}

const page: FC<pageProps> = async ({ searchParams }) => {
  return (
    <div>
      <div className="flex flex-col gap-10">
        <SelectClientForInvoice></SelectClientForInvoice>
        {searchParams.client && (
          <POSelection id={searchParams.client}></POSelection>
        )}
        {searchParams.orderId && (
          // <InvoiceForm id={searchParams.orderId} isInvoice={true}></InvoiceForm>
          <NewInvoiceForm orderId={searchParams.orderId}></NewInvoiceForm>
        )}
      </div>
    </div>
  );
};

export default page;
