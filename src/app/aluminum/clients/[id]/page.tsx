import AluminumClientForm from "@/components/aluminum/AluminumClientForm";
import { getAluminumClientDetailsBasedOnId } from "@/lib/aluminumQueries";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const customerDetails = await getAluminumClientDetailsBasedOnId(params.id);

  if (!customerDetails) redirect("/aluminum/clients");
  return (
    <div>
      <AluminumClientForm data={customerDetails.success}></AluminumClientForm>
    </div>
  );
};

export default page;
