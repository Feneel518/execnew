import EmployeesForm from "@/components/Dashboard/Employees/EmployeesForm";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <EmployeesForm></EmployeesForm>
    </div>
  );
};

export default page;
