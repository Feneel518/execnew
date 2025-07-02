import LoginForm from "@/components/auth/Forms/LoginForm";
import { FC, Suspense } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <Suspense>
      <LoginForm></LoginForm>
    </Suspense>
  );
};

export default page;
