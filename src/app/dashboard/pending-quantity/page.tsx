import { FC } from "react";

import PendingQuantityTable from "@/components/Dashboard/PendingQuantity/PendingQuantityTable";
import SelectProductForPending from "@/components/Dashboard/PendingQuantity/SelectProductForPending";

interface pageProps {
  searchParams: { product: string | undefined };
}

const page: FC<pageProps> = ({ searchParams }) => {
  return (
    <div>
      <SelectProductForPending></SelectProductForPending>

      <PendingQuantityTable id={searchParams.product}></PendingQuantityTable>
    </div>
  );
};

export default page;
