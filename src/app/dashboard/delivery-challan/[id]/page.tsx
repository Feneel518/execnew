import ChallanForm from "@/components/Dashboard/DeliveryChallan/ChallanForm";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const challan = await db.deliveryChallan.findUnique({
    where: {
      id: params.id,
    },
    include: {
      ProductInChallan: true,
    },
  });

  if (!challan) return;
  return (
    <div>
      <ChallanForm challan={challan}></ChallanForm>
    </div>
  );
};

export default page;
