import RegisterForm from "@/components/auth/Forms/RegisterForm";
import { FC, Suspense } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Suspense>
      <RegisterForm></RegisterForm>
    </Suspense>
  );
};

export default page;
