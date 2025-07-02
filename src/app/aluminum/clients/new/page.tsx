import AluminumClientForm from "@/components/aluminum/AluminumClientForm";
import CustomerForm from "@/components/Dashboard/Customers/CustomerForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <AluminumClientForm></AluminumClientForm>
    </div>
  );
};

export default page;
