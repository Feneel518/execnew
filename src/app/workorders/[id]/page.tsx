import {
  getOrderDetailsBasedOnId,
  getOrderDetailsForInvoice,
} from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";
import DownloadButton from "@/components/Global/DownloadButton";
import Order from "@/components/Dashboard/Order/Order";
import { calculateRemainingQuantities } from "@/lib/utils";

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
  const orderData = await getOrderDetailsBasedOnId(params.id);

  if (!orderData?.success) return;

  const orderDetails = await getOrderDetailsForInvoice(params.id);

  if (!orderDetails?.success || orderDetails.error) return;
  const acc = calculateRemainingQuantities(
    orderDetails.success,
    orderDetails.success.Invoice
  );

  return (
    <div
      className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
    >
      <DownloadButton
        quotationNumber={orderData.success.orderNumber}
        // @ts-ignore
        clientName={orderData.success.customer.name}
      ></DownloadButton>

      {/* <Quotation quotationData={orderData?.success}></Quotation> */}
      <Order
        isWorkOrder={true}
        orderData={orderData.success}
        remainingQuantity={acc}
      ></Order>
    </div>
  );
};

export default page;
