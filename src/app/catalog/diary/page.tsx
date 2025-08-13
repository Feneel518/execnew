import ProductsDiaryPage from "@/components/Frontend/Gallery/ProductsDiaryPage";
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
      <ProductsDiaryPage></ProductsDiaryPage>
    </div>
  );
};

export default page;
