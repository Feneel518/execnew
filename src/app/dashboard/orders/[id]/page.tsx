import OrderForm from "@/components/Dashboard/Orders/OrderForm";
import { getOrderBasedOnId } from "@/lib/queries";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const orderData = await getOrderBasedOnId(params.id);

  return (
    <div>
      <OrderForm isEdit={true} orderData={orderData?.success}></OrderForm>
    </div>
  );
};

export default page;
