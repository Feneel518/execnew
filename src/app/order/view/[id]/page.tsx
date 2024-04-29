import { getOrderDetailsBasedOnId } from "@/lib/queries";
import { Lora } from "next/font/google";
import { FC } from "react";
import DownloadButton from "@/components/Global/DownloadButton";
import Order from "@/components/Dashboard/Order/Order";
import { Metadata } from "next";

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

  if (!orderData?.success) return;

  console.log(orderData.success.ProductInOrder);

  return (
    <div
      className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
    >
      {/* <DownloadButton
        quotationNumber={orderData.success.orderNumber}
        clientName={orderData.success.customer.name}
      ></DownloadButton> */}

      {/* <Quotation quotationData={orderData?.success}></Quotation> */}
      <Order orderData={orderData.success}></Order>
    </div>
  );
};

export default page;
