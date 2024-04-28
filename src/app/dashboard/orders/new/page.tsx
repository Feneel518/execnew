import OrderForm from "@/components/Dashboard/Orders/OrderForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <OrderForm></OrderForm>
    </div>
  );
};

export default page;
