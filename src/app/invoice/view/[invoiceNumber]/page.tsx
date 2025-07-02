import BoxSheet from "@/components/Dashboard/Invoice/BoxSheet";
import InvoicePage from "@/components/Dashboard/Invoice/InvoicePage";
import TestCertificate from "@/components/Dashboard/TestCertificate/TestCertificate";
import { getInvoiceDetailsBasedOnInvoiceNumber } from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";

interface pageProps {
  params: {
    invoiceNumber: string;
  };
}

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const page: FC<pageProps> = async ({ params }) => {
  const invoiceData = await getInvoiceDetailsBasedOnInvoiceNumber(
    params.invoiceNumber
  );
  if (!invoiceData?.success || invoiceData.error) return;

  return (
    <div className="">
      <div
        className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
      >
        <InvoicePage invoiceData={invoiceData.success}></InvoicePage>
      </div>

      <div
        className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
      >
        <TestCertificate invoiceData={invoiceData.success}></TestCertificate>
      </div>

      <div
        className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
      >
        <BoxSheet invoiceData={invoiceData.success}></BoxSheet>
      </div>
    </div>
  );
};

export default page;
