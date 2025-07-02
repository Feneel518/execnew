import TransactionForm from "@/components/aluminum/TransactionForm";
import { getSuppliers } from "@/lib/aluminumQueries";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const supplier = await getSuppliers();

  if (!supplier?.success || supplier.error) return;

  return (
    <div>
      <TransactionForm supplier={supplier.success}></TransactionForm>
      {/* <TransactionForm></TransactionForm> */}
    </div>
  );
};

export default page;
