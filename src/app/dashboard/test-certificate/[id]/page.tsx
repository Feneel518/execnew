import TestCertificateForm from "@/components/Dashboard/TestCertificate/TestCertificateForm";
import { getOrderDetailsBasedOnId } from "@/lib/queries";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const getOrderDetails = await getOrderDetailsBasedOnId(params.id);

  if (!getOrderDetails?.success || getOrderDetails.error) return;
  return (
    <div>
      <TestCertificateForm
        order={getOrderDetails?.success}
      ></TestCertificateForm>
    </div>
  );
};

export default page;
