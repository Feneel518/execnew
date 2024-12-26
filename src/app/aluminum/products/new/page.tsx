import AluminumProductForm from "@/components/aluminum/AluminumProductForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <AluminumProductForm></AluminumProductForm>
    </div>
  );
};

export default page;
