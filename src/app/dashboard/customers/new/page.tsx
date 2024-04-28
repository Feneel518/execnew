import CustomerForm from "@/components/Dashboard/Customers/CustomerForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <CustomerForm></CustomerForm>
    </div>
  );
};

export default page;
