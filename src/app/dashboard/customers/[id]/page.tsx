import CustomerForm from "@/components/Dashboard/Customers/CustomerForm";
import { getCustomerDetailsBasedOnId } from "@/lib/queries";
import { Customer } from "@prisma/client";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const customerDetails = await getCustomerDetailsBasedOnId(params.id);

  if (!customerDetails) redirect("/dashboard/customers");

  return (
    <div>
      <CustomerForm data={customerDetails.success}></CustomerForm>
    </div>
  );
};

export default page;
