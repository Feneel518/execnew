import InventoryForm from "@/components/Dashboard/Inventory/InventoryForm";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const employee = await db.employee.findMany({
    select: {
      name: true,
      id: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div>
      <InventoryForm employee={employee}></InventoryForm>
    </div>
  );
};

export default page;
