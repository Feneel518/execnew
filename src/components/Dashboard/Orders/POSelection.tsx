import { fetchPONumberBasedOnCustomer } from "@/lib/queries";
import { FC } from "react";

import { Label } from "@/components/ui/label";
import SelectPO from "../Invoice/SelectPO";

interface POSelectionProps {
  id: string;
}

const POSelection: FC<POSelectionProps> = async ({ id }) => {
  if (!id) return;

  const orders = await fetchPONumberBasedOnCustomer(id);
  return (
    <div className="flex flex-col gap-2">
      <Label>Order Number & PO Number</Label>
      {orders?.success && (
        <SelectPO clientId={id} orders={orders.success}></SelectPO>
      )}
    </div>
  );
};

export default POSelection;
