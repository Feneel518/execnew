import { FC } from "react";

import PendingQuantityTable from "@/components/Dashboard/PendingQuantity/PendingQuantityTable";
import SelectProductForPending from "@/components/Dashboard/PendingQuantity/SelectProductForPending";
import PendingCustomerTable from "@/components/Dashboard/PendingQuantity/PendingCustomerTable";

interface pageProps {
  searchParams: { product: string | undefined; client: string | undefined };
}

const page: FC<pageProps> = ({ searchParams }) => {
  return (
    <div>
      <div className="print:hidden">
        <SelectProductForPending></SelectProductForPending>
      </div>

      {searchParams.product && (
        <PendingQuantityTable id={searchParams.product}></PendingQuantityTable>
      )}
      {searchParams.client && (
        <PendingCustomerTable id={searchParams.client}></PendingCustomerTable>
      )}
    </div>
  );
};

export default page;
