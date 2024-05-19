import StockProductsForPrint from "@/components/Dashboard/StoreProduct/StockProductsForPrint";
import DownloadButton from "@/components/Global/DownloadButton";
import { db } from "@/lib/db";
import { Lora } from "next/font/google";
import { FC } from "react";

interface pageProps {}
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const page: FC<pageProps> = async ({}) => {
  const product = await db.storeProduct.findMany({});
  return (
    <div
      className={` ${lora.className} flex flex-col items-center justify-center gap-4 print:gap-0 my-20 print:my-0`}
    >
      <DownloadButton></DownloadButton>

      <StockProductsForPrint product={product}></StockProductsForPrint>
    </div>
  );
};

export default page;
