import InventoryForm from "@/components/Dashboard/Inventory/InventoryForm";
import { db } from "@/lib/db";
import { getEmployees } from "@/lib/queries";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const employee = await getEmployees();

  if (!employee?.success || employee.error) return;
  return (
    <div>
      <InventoryForm employee={employee?.success}></InventoryForm>
    </div>
  );
};

export default page;
