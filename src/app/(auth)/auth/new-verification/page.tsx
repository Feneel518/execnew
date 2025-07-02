import NewVerificationForm from "@/components/auth/Forms/NewVerificationForm";
import { FC, Suspense } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Suspense>
      <NewVerificationForm></NewVerificationForm>
    </Suspense>
  );
};

export default page;
