import PerfomaInvoicePage from "@/components/Dashboard/Perfoma/PerfomaInvoicePage";
import DownloadButton from "@/components/Global/DownloadButton";
import { getPerfomaInvoiceDetailsBasedOnIPerfomanvoiceNumber } from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const page: FC<pageProps> = async ({ params }) => {
  const invoiceData = await getPerfomaInvoiceDetailsBasedOnIPerfomanvoiceNumber(
    params.id
  );
  if (!invoiceData?.success || invoiceData.error) return;

  return (
    <div className="">
      <div
        className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
      >
        <DownloadButton
          quotationNumber={invoiceData.success.perfomaInvoiceNumber}
          clientName={invoiceData.success.order.customer.name}
          isPerfoma={true}
        ></DownloadButton>
        <PerfomaInvoicePage
          invoiceData={invoiceData.success}
        ></PerfomaInvoicePage>
      </div>
    </div>
  );
};

export default page;
