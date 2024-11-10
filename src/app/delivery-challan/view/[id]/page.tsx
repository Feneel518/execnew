import Challan from "@/components/Dashboard/DeliveryChallan/Challan";
import Order from "@/components/Dashboard/Order/Order";
import {
  getChallanDetailsBasedOnId,
  getOrderDetailsBasedOnId,
  getOrderDetailsForInvoice,
} from "@/lib/queries";
import { calculateRemainingQuantities } from "@/lib/utils";
import { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata> {
  // read route params
  const challanData = await getChallanDetailsBasedOnId(params.id);

  return {
    title: `${challanData?.success?.challanNumber} | ${challanData?.success?.customer.name}`,
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const challanData = await getChallanDetailsBasedOnId(params.id);

  if (!challanData?.success) return;

  return (
    <div
      className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
    >
      <Challan challan={challanData.success}></Challan>
    </div>
  );
};

export default page;
