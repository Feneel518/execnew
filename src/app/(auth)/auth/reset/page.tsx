import ResetForm from "@/components/auth/Forms/ResetForm";
import { FC, Suspense } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Suspense>
      <ResetForm></ResetForm>
    </Suspense>
  );
};

export default page;
