import AluminumStock from "@/components/aluminum/AluminumStock";
import CastingStock from "@/components/aluminum/CastingStock";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <div className="grid grid-cols-2 gap-20">
      <AluminumStock></AluminumStock>
      <CastingStock></CastingStock>
    </div>
  );
};

export default page;
