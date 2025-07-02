import FifthPage from "@/components/catalog/FifthPage";
import FirstPage from "@/components/catalog/FirstPage";
import FouthPage from "@/components/catalog/FouthPage";
import ProductsPage from "@/components/catalog/ProductsPage";
import SecondPage from "@/components/catalog/SecondPage";
import ThirdPage from "@/components/catalog/ThirdPage";
import { Montserrat } from "next/font/google";
import { FC } from "react";

interface pageProps {}
const font = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const page: FC<pageProps> = ({}) => {
  return (
    <div className={`flex flex-col items-center gap-8 ${font.className}`}>
      <ProductsPage></ProductsPage>
    </div>
  );
};

export default page;
