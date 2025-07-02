import CategoryForm from "@/components/Dashboard/Categories/CategoryForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <CategoryForm></CategoryForm>
    </div>
  );
};

export default page;
