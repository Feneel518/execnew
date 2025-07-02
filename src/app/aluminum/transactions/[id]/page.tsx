import TransactionForm from "@/components/aluminum/TransactionForm";
import { getSuppliers, getTransactionBasedOnId } from "@/lib/aluminumQueries";
import { redirect } from "next/navigation";

import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const transaction = await getTransactionBasedOnId(params.id);

  const supplier = await getSuppliers();

  if (!supplier?.success || supplier.error) return;

  if (!transaction || transaction.error || !transaction.success)
    redirect("/aluminum/transaction");
  return (
    <div>
      <TransactionForm
        supplier={supplier.success}
        transaction={transaction.success}
      ></TransactionForm>
    </div>
  );
};

export default page;
