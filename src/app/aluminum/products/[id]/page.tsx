import AluminumProductForm from "@/components/aluminum/AluminumProductForm";
import { getCastingDetailsBasedOnId } from "@/lib/aluminumQueries";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const CastingDetails = await getCastingDetailsBasedOnId(params.id);

  if (!CastingDetails) redirect("/aluminum/clients");
  return (
    <div>
      <AluminumProductForm data={CastingDetails.success}></AluminumProductForm>
    </div>
  );
};

export default page;
