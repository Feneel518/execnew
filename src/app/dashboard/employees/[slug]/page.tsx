import EmployeesForm from "@/components/Dashboard/Employees/EmployeesForm";
import { getCustomerDetailsBasedOnSlug } from "@/lib/queries";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const employeeDetails = await getCustomerDetailsBasedOnSlug(params.slug);
  return (
    <div>
      <EmployeesForm productData={employeeDetails?.success}></EmployeesForm>
    </div>
  );
};

export default page;
