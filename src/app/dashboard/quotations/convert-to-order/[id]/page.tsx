import OrderForm from "@/components/Dashboard/Orders/OrderForm";
import { fetchPreviousOrderNumber, getQuotationBasedOnid } from "@/lib/queries";
import { OrderForDashboard } from "@/lib/types";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const quotationDetails = await getQuotationBasedOnid(params.id);
  const orderNumber = await fetchPreviousOrderNumber();

  if (!quotationDetails?.success || quotationDetails.error) return;

  const orderData: OrderForDashboard = {
    id: "",
    customerId: quotationDetails.success.customerId,
    notes: "",
    orderNumber: orderNumber?.success ? orderNumber.success.orderNumber + 1 : 1,
    poNumber: "",
    poDate: new Date(),
    quotationNumber: String(quotationDetails.success.quotationNumber),
    orderPDFFile: "",
    status: "PENDING",
    ProductInOrder: quotationDetails.success.ProductInQuotation.map(
      (product, index) => {
        return {
          certificateNumber: "",
          description: "",
          id: "",
          index: index + 1,
          price: product.price,
          productId: product.productId,
          quantity: product.quantity === "UR" ? 0 : Number(product.quantity),
          supplied: 0,
        };
      }
    ),
  };

  return (
    <div>
      <OrderForm isEdit={true} orderData={orderData}></OrderForm>
    </div>
  );
};

export default page;
