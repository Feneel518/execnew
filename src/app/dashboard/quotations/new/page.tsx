import QuotationForm from "@/components/Dashboard/Quotations/QuotationForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <QuotationForm></QuotationForm>
    </div>
  );
};

export default page;
