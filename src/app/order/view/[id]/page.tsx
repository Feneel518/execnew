import {
  getOrderDetailsBasedOnId,
  getOrderDetailsForInvoice,
} from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";
import DownloadButton from "@/components/Global/DownloadButton";
import Order from "@/components/Dashboard/Order/Order";
import { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata> {
  // read route params
  const orderData = await getOrderDetailsBasedOnId(params.id);

  return {
    title: `${orderData?.success?.orderNumber} | ${orderData?.success?.customer.name}`,
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const orderData = await getOrderDetailsBasedOnId(params.id);

  const orderDetails = await getOrderDetailsForInvoice(params.id);

  if (!orderDetails?.success || orderDetails.error) return;
  const acc = calculateRemainingQuantities(
    orderDetails.success,
    orderDetails.success.Invoice
  );

  if (!orderData?.success) return;

  return (
    <div
      className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
    >
      <Order orderData={orderData.success} remainingQuantity={acc}></Order>
    </div>
  );
};

export default page;
