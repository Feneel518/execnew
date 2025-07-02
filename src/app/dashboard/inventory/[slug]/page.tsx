import InventoryForm from "@/components/Dashboard/Inventory/InventoryForm";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const inventroyData = await db.inventory.findUnique({
    where: {
      id: params.slug,
    },
    select: {
      id: true,
      storeProductId: true,
      employeeId: true,
      status: true,
      quantity: true,
    },
  });
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
      <InventoryForm
        employee={employee}
        inventoryData={inventroyData}
      ></InventoryForm>
    </div>
  );
};

export default page;
