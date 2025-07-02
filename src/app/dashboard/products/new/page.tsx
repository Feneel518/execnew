import ProductForm from "@/components/Dashboard/Products/ProductForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <ProductForm></ProductForm>
    </div>
  );
};

export default page;
