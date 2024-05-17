import StoreProductForm from "@/components/Dashboard/StoreProduct/StoreProductForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <StoreProductForm></StoreProductForm>
    </div>
  );
};

export default page;
