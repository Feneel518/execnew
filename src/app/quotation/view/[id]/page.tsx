import Quotation from "@/components/Dashboard/Quotations/Quotation";
import { Button } from "@/components/ui/button";
import { getQuotationBasedOnid } from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";
import axios from "axios";
import DownloadButton from "@/components/Global/DownloadButton";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import ShowCalculation from "@/components/Dashboard/Quotations/ShowCalculation";

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
  const quotationData = await getQuotationBasedOnid(params.id);

  if (!quotationData?.success) return;

  const quotationTotal = quotationData.success.ProductInQuotation.reduce(
    (acc, total) => {
      return (
        acc +
        (total.quantity === "UR" ? 1 : Number(total.quantity)) * total.price
      );
    },
    0
  );

  return (
    <div
      className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
    >
      <DownloadButton
        quotationNumber={quotationData.success.quotationNumber}
        clientName={quotationData.success.customer.name}
      ></DownloadButton>
      <ShowCalculation quotationTotal={quotationTotal}></ShowCalculation>

      <Quotation quotationData={quotationData?.success}></Quotation>
    </div>
  );
};

export default page;
